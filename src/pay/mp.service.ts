import { MercadoPagoConfig, Preference } from 'mercadopago';
import { SaleService } from "src/sale/sale.service";
import { PayService } from "./pay.service";
import { PayInterface } from "src/common/interfaces/pay-interface";
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
                //success: `https://tuapp.com/pago/success?saleId=${saleId}`,
                //failure: `https://tuapp.com/pago/failure?saleId=${saleId}`,
                //pending: `https://tuapp.com/pago/pending?saleId=${saleId}`,
            },
            auto_return: 'approved',
            notification_url: 'https://localhost:3000/pay/webhooks' //Ver si va
        }
      
    });
    
    //ACA abria que guardar en BD el pago inicial y luego actualizarlo cuando tengamos respuesta de MP

    return result.init_point; // URL para redirigir al usuario
  }
}