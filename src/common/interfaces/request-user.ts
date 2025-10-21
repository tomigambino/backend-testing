import { Request } from 'express';
import { CustomerEntity } from '../entities/customer.entity';


export interface RequestWithUser extends Request {
  customer?: CustomerEntity;
}