import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { MercadoPagoService } from './mp.service';
import { PayService } from './pay.service';


@Controller('pay')
export class PayController {

    constructor(
    private readonly mpService: MercadoPagoService,
    private readonly payService: PayService
  ) {}

    @Get(':id')
    async generarPago(@Param('id') saleId: number): Promise<string | undefined> {
        return await this.mpService.createPreference(saleId);
    }

    // Implementar esta lógica
    /*
    @Post('webhooks/mercadopago')
    async obtenerWebhook(@Req() request) {
      return await this.payService.obtenerWebhook(request)
    }
    */
}
