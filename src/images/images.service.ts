import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image, ImageType } from './entities/image.entity';
import { User } from 'src/users/entities/user.entity';
import { ImageQuery } from './images.controller';
import { deleteImage } from 'src/helpers';

@Injectable()
export class ImagesService {
  constructor(@InjectRepository(Image) private readonly imagesRepository: Repository<Image>) { }

  async create(type: ImageType, filename: string, user: User) {
    const image = this.imagesRepository.create({
      user, type,
      url: filename,
    });

    if (!image) throw new BadRequestException('Could not create an image');
    return await this.imagesRepository.save(image);
  }

  async findAll(query: ImageQuery) {
    const images = await this.imagesRepository.find({ ...query });
    if (!images || images.length == 0) throw new NotFoundException('Images are not found.');
    return images;
  }

  async findOne(id: number) {
    const image = await this.imagesRepository.findOneBy({ id });
    if (!image) throw new NotFoundException('Image is not found.');
    return image;
  }

  async update(id: number, filename: string) {
    try {
      const image = await this.findOne(id);
      deleteImage(image.url);
      Object.assign(image, { url: filename })
      return await this.imagesRepository.save(image);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const image = await this.findOne(id);
      deleteImage(image.url);
      await this.imagesRepository.remove(image);
      return { message: 'Image was successfully deleted' }
    } catch (error) {
      throw error;
    }
  }
}
