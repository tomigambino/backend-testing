import { Body, Controller, Get, HttpCode, Param, Post, Req } from '@nestjs/common';
import { MercadoPagoService } from './mp.service';
import { PayService } from './pay.service';


@Controller('pago')
export class PayController {

    constructor(
    private readonly mpService: MercadoPagoService,
    private readonly payService: PayService
  ) {}

    @Get(':id')
    async generarPago(@Param('id') saleId: number): Promise<string | undefined> {
        return await this.mpService.createPreference(saleId);
    }

    @Post('webhooks/mercadopago')
    @HttpCode(200)
    async getWebhook(@Body() body) {
      console.log("Entro al controller")
      return await this.payService.getWebhook(body)
    }
}
