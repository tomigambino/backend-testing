import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from 'src/common/entities/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity])],
  controllers: [ImagesController],
  providers: [ImagesService]
})
export class ImagesModule {}
