import { MercadoPagoConfig, Preference } from 'mercadopago';
import { SaleService } from "src/sale/sale.service";
import { PayService } from "./pay.service";
import { InitialPay } from "src/common/interfaces/pay-interface";
import { Injectable } from '@nestjs/common';

@Injectable()
export class MercadoPagoService {

    private mercadoPago = new MercadoPagoConfig({accessToken: process.env.MP_ACCESS_TOKEN as string}) // as string para forzarlo a leer la variable de .env
  
    constructor(
        private saleService: SaleService,
        private payService: PayService
    ) {}

  async createPreference(saleId: number) {
    const items = await this.saleService.findItemsSaleById(saleId)

    const preference = new Preference(this.mercadoPago)

    const result = await preference.create({
        body: {
            items,
            back_urls: {
                //Agregar url a la que sera guiada
                success: 'https://localhost:4200',
                //failure: `https://tuapp.com/pago/failure?saleId=${saleId}`,
                //pending: `https://tuapp.com/pago/pending?saleId=${saleId}`,
            },
            auto_return: 'approved',
            notification_url: "https://funciona.loca.lt/pago/webhooks/mercadopago" //'https://localhost:3000/pago/webhooks' //Ver si va, NO puede ser local ya que no nos va a llegar la respuesta de MP
        }
    });

    if (!result.id || !result.init_point) {
        throw new Error('No se pudo obtener mpPreferenceId o mpInitPoint de Mercado Pago');
    }
    
    //ACA abria que guardar en BD el pago inicial y luego actualizarlo cuando tengamos respuesta de MP
    const pay: InitialPay = {
        mpPreferenceId: result.id,   // result.id de MP
        mpInitPoint: result.init_point,      // result.init_point de MP
        mpState: 'pending',          // Se va actualizando con la respuesta del webhook
        amount: items.reduce((sumatoria, item) => {
            return sumatoria + item.unit_price * item.quantity;
        }, 0),          // total de la venta
        creationDate: new Date()
    }
    this.payService.createPay(pay)

    return result.init_point; // URL para redirigir al usuario
  }
}