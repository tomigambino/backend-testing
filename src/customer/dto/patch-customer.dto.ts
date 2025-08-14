import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from "./create-customer.dto";

// De esta manera se mantien las mismas propiedades sincronizadas con el create, pero ahora son opcionales.
export class PatchCustomerDto extends PartialType(CreateCustomerDto) {}
