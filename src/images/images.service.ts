import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { supabase } from '../common/config/supabase.client';
import { v4 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageEntity } from 'src/common/entities/image.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepo: Repository<ImageEntity>,
  ) {}

  async uploadImage(file: Express.Multer.File, productId: number) {
    if (!file) {
      throw new HttpException('No se recibió ningún archivo', HttpStatus.BAD_REQUEST);
    }

    const fileBuffer = file.buffer;

    // Con esto generamos un nombre unico para la imagen con el fin de evitar colisiones
    const fileExt = file.originalname.split('.').pop();
    const uniqueName = `${uuid()}.${fileExt}`;
    const storagePath = `products/${productId}/${uniqueName}`;

    // Sube la imagen a supabase
    const { data, error } = await supabase
      .storage
      .from('images-testing')
      .upload(storagePath, fileBuffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    const publicUrl = supabase
      .storage
      .from('images-testing')
      .getPublicUrl(data.path).data.publicUrl;

    // Esto guarda los datos de la imagen en nuestra bd para luego poder llamarla
    const imageData = this.imageRepo.create({
      product_id: productId,
      url: publicUrl,
      name: uniqueName,
      size: `${(file.size / 1024).toFixed(2)} KB`,
    });

    await this.imageRepo.save(imageData);

    return imageData;
  }

  // Función para que traigamos las imagenes según el producto al que pertenezca
  async getImagesByProduct(productId: number) {
    return await this.imageRepo.find({ where: { product_id: productId } });
  }

  // Esto traería una imagen especifica - VER SI LA VAMOS A USAR O LO MANEJAMOS DESDE EL FRONTEND
  async getSpecificImage(productId: number, imageId: number) {
    const image = await this.imageRepo.findOne({where: { id: imageId, product_id: productId }});

    if (!image) {
      throw new HttpException(`Imagen no encontrada`, HttpStatus.NOT_FOUND);
    }

    return image;
  }


}
