import { Body, Controller, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { MercadoPagoService } from './mp.service';
import { PayService } from './pay.service';
import { RolesDecorator } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/roles.enum';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/common/decorators/public.decorator';

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

    @Public()
    @Post('webhooks/mercadopago')
    @HttpCode(200)
    async getWebhook(@Body() body) {
      return await this.payService.getWebhook(body)
    }
}
