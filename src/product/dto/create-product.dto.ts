import {  Type } from "class-transformer";
import { IsBoolean, IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto{
    @IsDefined({ message: 'El id de tipo de producto es obligatorio.' })
    @IsNumber()
    @Type(() => Number)
    productTypeId: number;

    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    @IsString({ message: 'El nombre debe ser un texto.' })
    name: string;

    @IsOptional()
    @IsString({ message: 'La descripción debe ser un texto.' })
    description: string;

    @IsDefined({ message: 'El precio publicado es obligatorio.' })
    @IsNumber()
    @Type(() => Number)
    price: number;

    @IsNumber()
    @Type(() => Number)
    stock: number;

    @IsDefined({ message: 'El estado de actividad es obligatorio.' })
    @IsBoolean({ message: 'El estado de actividad debe ser un valor booleano.' })
    @Type(() => Boolean)
    isActive: boolean;
}