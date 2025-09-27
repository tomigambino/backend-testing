import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsDefined, IsNumber } from "class-validator";

export class CreateSaleDto{
    //Fecha de venta la vamos a obtener en el servicio ya que se asigna automáticamente el mismo dia

    @IsDefined({ message: 'El id de cliente es obligatorio.' })
    @IsNumber({}, { message: 'El id de cliente debe ser un número.' })
    customerId: number;

    @IsDefined({ message: 'Los IDs de detalles de venta son obligatorios.' })
    @IsArray({ message: 'detalleVentaIds debe ser un array' })
    @ArrayNotEmpty({ message: 'detalleVentaIds should not be empty' })
    @Type(() => Number)
    saleDetailIds: number[];

    //El total se calcula en el servicio de venta
    //El estado de venta se asigna por defecto a "Pendiente"
}