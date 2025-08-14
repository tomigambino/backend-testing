import { PartialType } from '@nestjs/mapped-types';
import { CreateSaleDetailDto } from './create-saleDetail.dto';

export class UpdateSaleDetailDto extends PartialType(CreateSaleDetailDto) { }
