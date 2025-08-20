import { IsString, IsNotEmpty, IsDefined, IsNumber, IsPositive, Min } from 'class-validator';

export class CreateSaleDetailDto {

    @IsDefined({ message: 'El id de producto es obligatorio.' })
    @IsNumber({}, { message: 'El id de producto debe ser un número.' })
    productId: number;

    @Min(1, { message: 'La cantidad debe ser al menos 1' })
    @IsDefined({ message: 'La cantidad es obligatoria.' })
    @IsNumber({}, { message: 'La cantidad debe ser un número.' })
    @IsPositive({ message: 'La cantidad debe ser un número positivo.' })
    quantity: number;

    @IsNotEmpty({ message: 'El color es obligatorio.' })
    @IsString({ message: 'El color debe ser un texto.' })
    color: string;

    //El total del detalle de venta se calcula en el servicio
}
