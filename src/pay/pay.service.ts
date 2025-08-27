import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PayEntity } from 'src/common/entities/pay.entity';
import { PayInterface } from 'src/common/interfaces/pay-interface';
import { Repository } from 'typeorm';

@Injectable()
export class PayService {

    constructor(@InjectRepository(PayEntity) private payRepository: Repository<PayEntity>) {}


    async createPay(payInterface: PayInterface) {
        const pay = this.payRepository.create({
            mpPreferenceId: payInterface.mpPreferenceId,
            mpInitPoint: payInterface.mpInitPoint,
            mpPaymentMethod: payInterface.mpPaymentMethod ?? null, // null porque al inicio no lo tenemos
            mpState: payInterface.mpState,
            amount: payInterface.amount,
            creationDate: payInterface.creationDate,
            approvalDate: payInterface.approvalDate ?? null // null hasta que el pago se apruebe
        });

        return await this.payRepository.save(pay);
    }


    //Implementar esta función
    /*
    async obtenerWebhook(request: Request){
        const { id, topic } = request.
    }
    */
}
