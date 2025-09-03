import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import MercadoPagoConfig, { Payment } from 'mercadopago';
import { PayEntity } from 'src/common/entities/pay.entity';
import { InitialPay } from 'src/common/interfaces/pay-interface';
import { UpdatePay } from 'src/common/interfaces/update-interface';
import { Repository } from 'typeorm';

@Injectable()
export class PayService {

    private payment: Payment 

    constructor(@InjectRepository(PayEntity) private payRepository: Repository<PayEntity>) {
        const client = new MercadoPagoConfig({
        accessToken: process.env.MP_ACCESS_TOKEN as string,
        });
        this.payment = new Payment(client);
    }


    async createPay(payInterface: InitialPay) {
        const pay = this.payRepository.create({
            mpPreferenceId: payInterface.mpPreferenceId,
            mpInitPoint: payInterface.mpInitPoint,
            mpState: payInterface.mpState,
            amount: payInterface.amount,
            creationDate: payInterface.creationDate
        });

        return await this.payRepository.save(pay);
    }

    async updatePay(preferenceId: number, updatePayInterface: UpdatePay){
        const pay = await this.findPayByPreferenceId(preferenceId)
        console.log("updatePay, pay:", pay)

        Object.assign(pay, updatePayInterface);

        return await this.payRepository.save(pay);
    }

    async findPayByPreferenceId(preferenceId: number){
        const pay = await this.payRepository.findOne({
            where: {mpPreferenceId: preferenceId.toString()}
        })

        if (!pay) {
            throw new NotFoundException(`Pago con ID ${preferenceId} no encontrado`);
        }
        
        return pay;
    }

    async getWebhook(body){
        try {
            console.log("body:", body)
            console.log("data:", body.data)
            const paymentId: string = body.data.id;
            console.log("topic:",body.type)
            const topic: string = body.type;
            console.log("paymentId:",paymentId)
            

            console.log(paymentId, topic)

            if (topic === 'payment' && paymentId) {
                await this.processWebhookPay(paymentId);
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
        console.log("processWebhookPay, payment:", paymentId)
        const payment = await this.payment.get({id: paymentId}); 
        console.log("processWebhookPay, payment:", payment)
        if (payment.payment_method_id && payment.status){
            const updatePay: UpdatePay = {
            mpPaymentMethod: payment.payment_method_id,
            mpState: payment.status,
            approvalDate: payment.date_approved // Verificamos que exista date_approved, si existe creamos el Date y si no lo dejamos null
            ? new Date(payment.date_approved)
            : null
            }

            const preferenceId = payment.order?.id;
            console.log("preferenceId:", preferenceId)
            if(!preferenceId){
                throw new Error(`No se encontró preferenceId para el pago ${paymentId}`)
            }
            await this.updatePay(preferenceId, updatePay)

        }
    }
}
