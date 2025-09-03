import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import MercadoPagoConfig, { Payment, MerchantOrder } from 'mercadopago';
import { PayEntity } from 'src/common/entities/pay.entity';
import { InitialPay } from 'src/common/interfaces/pay-interface';
import { UpdatePay } from 'src/common/interfaces/update-interface';
import { SaleService } from 'src/sale/sale.service';
import { Repository } from 'typeorm';

@Injectable()
export class PayService {

    private payment: Payment 
    private merchantOrder: MerchantOrder
    constructor(
            @InjectRepository(PayEntity) private payRepository: Repository<PayEntity>,
            private saleService: SaleService,
        ) {
        const client = new MercadoPagoConfig({
        accessToken: process.env.MP_ACCESS_TOKEN as string,
        });
        this.payment = new Payment(client);
        this.merchantOrder = new MerchantOrder(client);
    }


    async createPay(payInterface: InitialPay, saleId: number): Promise<PayEntity> {
        const pay = this.payRepository.create({
            mpPreferenceId: payInterface.mpPreferenceId,
            mpInitPoint: payInterface.mpInitPoint,
            mpState: payInterface.mpState,
            amount: payInterface.amount,
            creationDate: payInterface.creationDate
        });

        await this.payRepository.save(pay);
        await this.saleService.asignPaymentToSale(saleId, pay);
        return pay;
    }

    async updatePay(saleId: number, updatePayInterface: UpdatePay){
        const pay = await this.findPayBySaleId(saleId)

        Object.assign(pay, updatePayInterface);
        await this.saleService.updateSalePaymentStatus(saleId, updatePayInterface.mpState);
        return await this.payRepository.save(pay);
    }

    async findPayBySaleId(saleId: number){
        const pay = await this.payRepository.findOne({
            where: {sale: {id: saleId}}
        })

        if (!pay) {
            throw new NotFoundException(`Pago con venta ID ${saleId} no encontrado`); //Este error salto 3370640534
        }
        
        return pay;
    }

    async getWebhook(body){
        try {

            let paymentId: string | undefined;
            let topic: string | undefined;
            let merchantOrderId: string | undefined;
            
            // Verificamos si es de tipo payment o merchant order
            if (body.type === 'payment' || body.topic === 'payment') {
                topic = 'payment';
                paymentId = body?.data?.id;
            }

            else if (body.topic === 'merchant_order') {
                topic = 'merchant_order';
                const match = body.resource?.match(/\/(\d+)$/); // Extramos el id de la url brindada por MP
                if (match) {
                    merchantOrderId = match[1];
                }
            }

            // Procesamos según tipo
            if (topic === 'payment' && paymentId) {
            await this.processWebhookPay(paymentId);
            } 
            else if (topic === 'merchant_order' && merchantOrderId) {
            const order = await this.merchantOrder.get({ merchantOrderId });
            if (order.payments?.length) {
                for (const p of order.payments) {
                    if(p.id){
                        await this.processWebhookPay(p.id.toString());
                    }
                }
            }
            }
            
            return { status: 'ok' };
        } catch (error) {
            console.error('Error en webhook:', error);
            // Igual devolvemos 200 para que MP no reintente indefinidamente
            return { status: 'error', message: error.message };
        }
    }

    private async processWebhookPay(paymentId: string) {
    // Consultar detalles del pago en MP
        const payment = await this.payment.get({id: paymentId});
        if (payment.payment_method_id && payment.status){
            const updatePay: UpdatePay = {
            mpPaymentMethod: payment.payment_method_id,
            mpState: payment.status,
            approvalDate: payment.date_approved // Verificamos que exista date_approved, si existe creamos el Date y si no lo dejamos null
            ? new Date(payment.date_approved)
            : null
            }

            const preferenceId = Number(payment.external_reference);
            if(!preferenceId){
                throw new Error(`No se encontró preferenceId para el pago ${preferenceId}`)
            }
            await this.updatePay(preferenceId, updatePay)
            await this.saleService.updateSalePaymentStatus(preferenceId, updatePay.mpState)

        }
    }
}
