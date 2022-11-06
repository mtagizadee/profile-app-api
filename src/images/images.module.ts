import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileFilterCallback, FileNameCallback, imageFilter, saveImage } from 'src/helpers';


@Module({
  controllers: [ImagesController],
  providers: [ImagesService],
  imports: [
    TypeOrmModule.forFeature([Image]),
    MulterModule.register({
      dest: './public',
      fileFilter: (req: any, file: Express.Multer.File, callback: FileFilterCallback) =>
        imageFilter(file, callback),
      storage: diskStorage({
        destination: './public',
        filename: (req: Express.Request, file: Express.Multer.File, callback: FileNameCallback) =>
          saveImage(file, callback)
      })
    })
  ]
})
export class ImagesModule { }
