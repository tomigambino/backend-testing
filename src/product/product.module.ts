import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { ProductEntity } from "src/common/entities/product.entity";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { ProductTypeModule } from "src/productType/productType.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    ProductTypeModule,
    AuthModule
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule {}
