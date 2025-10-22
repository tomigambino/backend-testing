import { CustomerEntity } from "./customer.entity"
import { SaleDetailEntity } from "./saleDetail"
import { SaleStatusEntity } from "./saleStatus"
import { ProductEntity } from "./product.entity"
import { ProductTypeEntity } from "./productType"
import { SaleEntity } from "./sale"
import { PayEntity } from "./pay.entity"
import { ImageEntity } from "./image.entity"
import { RoleEntity } from "./roles.entity"

export const entities = [
    RoleEntity, CustomerEntity, SaleDetailEntity, SaleStatusEntity,
    ProductEntity, ProductTypeEntity,
    SaleEntity, PayEntity, ImageEntity
]