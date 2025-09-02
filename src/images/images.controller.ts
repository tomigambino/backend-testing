import { Controller, Post, Get, Param, UploadedFile, UseInterceptors, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload/:productId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return await this.imagesService.uploadImage(file, productId);
  }

  @Get('product/:productId')
  async getImages(@Param('productId', ParseIntPipe) productId: number) {
    return await this.imagesService.getImagesByProduct(productId);
  }

  @Get('product/:productId/image/:imageId')
  async getSpecificImage(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('imageId', ParseIntPipe) imageId: number
  ) {
    return await this.imagesService.getSpecificImage(productId, imageId);
  }

}
