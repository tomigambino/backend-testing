import { IsString, IsNotEmpty} from 'class-validator'

export class CreateProductTypeDto{
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    @IsString({ message: 'El nombre debe ser un texto.' })
    name: string;

    @IsString({ message: 'La descripción debe ser un texto.' })
    description: string;
}
