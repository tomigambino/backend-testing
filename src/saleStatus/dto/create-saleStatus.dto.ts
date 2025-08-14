import { IsString, IsNotEmpty} from 'class-validator'

export class CreateSaleStateDto{
    @IsNotEmpty({ message: 'El valor es obligatorio.' })
    @IsString({ message: 'El valor debe ser un texto.' })
    value: string;
}