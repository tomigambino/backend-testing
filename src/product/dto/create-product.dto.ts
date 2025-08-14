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

    @IsDefined({ message: 'Las horas de impresión son obligatorias.' })
    @IsNumber()
    @Type(() => Number)
    printDuration: number;

    @IsDefined({ message: 'El peso es obligatorio.' })
    @IsNumber()
    @Type(() => Number)
    weight: number;

    @IsDefined({ message: 'El precio publicado es obligatorio.' })
    @IsNumber()
    @Type(() => Number)
    publishedPrice: number;

    @IsDefined({ message: 'El estado de actividad es obligatorio.' })
    @IsBoolean({ message: 'El estado de actividad debe ser un valor booleano.' })
    @Type(() => Boolean)
    isActive: boolean;
}