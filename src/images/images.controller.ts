import { Controller, Post, Get, Param, UploadedFile, UseInterceptors, ParseIntPipe, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesDecorator } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/roles.enum';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('images')
@UseGuards(AuthGuard)
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload/:productId')
  @RolesDecorator(Role.Owner || Role.Admin)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return await this.imagesService.uploadImage(file, productId);
  }

  @Public()
  @Get('product/:productId')
  async getImages(@Param('productId', ParseIntPipe) productId: number) {
    return await this.imagesService.getImagesByProduct(productId);
  }

  @Public()
  @Get('product/:productId/image/:imageId')
  async getSpecificImage(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('imageId', ParseIntPipe) imageId: number
  ) {
    return await this.imagesService.getSpecificImage(productId, imageId);
  }

}
