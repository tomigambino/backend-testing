import { IsString, IsNotEmpty, IsDefined, IsNumber, IsEmail} from 'class-validator'

export class CreateCustomerDto{
    @IsDefined({ message: 'El id de tipo de cliente es obligatorio.' })
    @IsNumber()
    customerTypeId: number;

    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    @IsString({ message: 'El nombre debe ser un texto.' })
    firstName: string;

    @IsNotEmpty({ message: 'El apellido es obligatorio.' })
    @IsString({ message: 'El apellido debe ser un texto.' })
    lastName: string;

    @IsString({ message: 'El telefono debe ser un texto.' })
    phone: string;

    @IsEmail({}, {message: 'El correo no tiene un formato valido.'})
    email: string;

    // La fecha de alta la obtendremos en el servicio
}