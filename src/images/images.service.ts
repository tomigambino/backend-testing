import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { supabase } from '../common/config/supabase.client';
import { v4 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageEntity } from 'src/common/entities/image.entity';

@Injectable()
export class ImagesService {
  
  // NO CONTEMPLAMOS ROLLBACK EN CASO DE ERROR AL SUBIR IMAGENES POR PARTE DE SUPABASE (almacenamiento, entre otros)

  constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepo: Repository<ImageEntity>,
  ) {}

  async uploadImage(file: Express.Multer.File, productId: number) {
    if (!file) {
      throw new BadRequestException('No se recibió ningún archivo');
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
      throw new BadRequestException(error.message);
    }

    const publicUrl = supabase
      .storage
      .from('images-testing')
      .getPublicUrl(data.path).data.publicUrl;

    // Esto guarda los datos de la imagen en nuestra bd para luego poder llamarla
    const imageData = this.imageRepo.create({
      product: { id: productId },
      url: publicUrl,
      name: uniqueName,
      size: `${(file.size / 1024).toFixed(2)} KB`,
    });

    await this.imageRepo.save(imageData);

    return imageData;
  }

  // Función para que traigamos las imagenes según el producto al que pertenezca
  async getImagesByProduct(productId: number) {
    return await this.imageRepo.find({ where: { product: { id: productId } } });
  }

  // Esto traería una imagen especifica - VER SI LA VAMOS A USAR O LO MANEJAMOS DESDE EL FRONTEND
  async getSpecificImage(productId: number, imageId: number) {
    const image = await this.imageRepo.findOne({where: { id: imageId, product: { id: productId } }});

    if (!image) {
      throw new HttpException(`Imagen no encontrada`, HttpStatus.NOT_FOUND);
    }

    return image;
  }

  async uploadMultipleImages(files: Express.Multer.File[], productId: number) {
    const uploadedImages: ImageEntity[] = [];

    for (const file of files) {
        const imageData = await this.uploadImage(file, productId);
        uploadedImages.push(imageData);
    }

    return uploadedImages;
  }

  async validateFiles(files: Express.Multer.File[]) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const file of files) {
        if (!file) {
            throw new BadRequestException('No se recibió ningún archivo');
        }

        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException(`Tipo de archivo no permitido: ${file.mimetype}. Solo se permiten: ${allowedMimeTypes.join(', ')}`)
        }

        if (file.size > maxSize) {
            throw new BadRequestException(`El archivo ${file.originalname} es demasiado grande. Máximo: 5MB`);
        }
    }
  }
}
