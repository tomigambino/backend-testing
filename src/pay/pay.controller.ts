import { Body, Controller, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { MercadoPagoService } from './mp.service';
import { PayService } from './pay.service';
import { RolesDecorator } from 'src/common/roles.decorator';
import { Role } from 'src/common/roles.enum';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('pago')
@UseGuards(AuthGuard)
export class PayController {

    constructor(
    private readonly mpService: MercadoPagoService,
    private readonly payService: PayService
  ) {}

    @Get(':id')
    @RolesDecorator(Role.User || Role.Admin)
    async generarPago(@Param('id') saleId: number): Promise<string | undefined> {
        return await this.mpService.createPreference(saleId);
    }

    @Post('webhooks/mercadopago')
    @HttpCode(200)
    async getWebhook(@Body() body) {
      return await this.payService.getWebhook(body)
    }
}
