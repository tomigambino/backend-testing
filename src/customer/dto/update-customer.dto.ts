import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

// Extiende las validaciones del LoginCustomerDto
// Agrega las propiedades adicionales necesarias para el registro
export class UpdateCustomerDto { 
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @Length(2, 50, { message: 'El nombre debe tener entre 2 y 50 caracteres' })
    firstName: string;

    @IsString()
    @Length(2, 50, { message: 'El apellido debe tener entre 2 y 50 caracteres' })
    lastName: string;

    @IsString({ message: 'El telefono debe ser un texto.' })
    phone: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}