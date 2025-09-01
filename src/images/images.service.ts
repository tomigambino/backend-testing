import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { supabase } from '../common/config/supabase.client';
import { readFileSync } from 'fs';

@Injectable()
export class ImagesService {

  async uploadImage(file: Express.Multer.File) {
    const fileBuffer = readFileSync(file.path);

    const { data, error } = await supabase
      .storage
      .from('images-testing') // ← tu bucket real
      .upload(`${file.originalname}`, fileBuffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
    const statusCode = Number((error as any).status) || HttpStatus.BAD_REQUEST;
    throw new HttpException(error.message, statusCode);
    }
    return {
      path: data.path,
      publicUrl: this.getPublicUrl(data.path),
    };
  }

  getPublicUrl(path: string) {
    return supabase.storage.from('images-testing').getPublicUrl(path).data.publicUrl;
  }

  'Para comprobar que encuentra el bucket'
  async testUpload() {
    const { data, error } = await supabase
      .storage
      .from('images-testing') // tu bucket exacto
      .upload('test.txt', Buffer.from('hola mundo'), {
        contentType: 'text/plain',
      });

    if (error) {
      console.error('Error en upload de prueba:', error);
      return { ok: false, error };
    }

    console.log('Upload de prueba OK:', data);
    return { ok: true, data };
  }
}
