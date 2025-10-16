import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from 'src/common/entities/image.entity';
import { ProductModule } from 'src/product/product.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity]), ProductModule, AuthModule],
  controllers: [ImagesController],
  providers: [ImagesService]
})
export class ImagesModule {}
