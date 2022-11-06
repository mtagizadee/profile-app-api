import { Controller, Get, Post, Query, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseIntPipe, UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UserHasImageGuard } from './guards/user-has-image.guard';

export type ImageQuery = {
  skip?: number;
  take?: number;
}

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) { }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @Post('avatar')
  createAvatar(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User
  ) {
    if (!file) throw new UnprocessableEntityException('Could not upload an image');
    return this.imagesService.create('avatar', file.filename, user);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('header'))
  @Post('header')
  createHeader(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User
  ) {
    if (!file) throw new UnprocessableEntityException('Could not upload an image');
    return this.imagesService.create('header', file.filename, user);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post('image')
  createImage(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User
  ) {
    if (!file) throw new UnprocessableEntityException('Could not upload an image');
    return this.imagesService.create('image', file.filename, user);
  }

  @Get()
  findAll(@Query() query: ImageQuery) {
    return this.imagesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.imagesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, UserHasImageGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Patch(':id')
  update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (!file) throw new UnprocessableEntityException('Could not upload file');
    return this.imagesService.update(id, file.filename);
  }

  @UseGuards(JwtAuthGuard, UserHasImageGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.imagesService.remove(id);
  }
}
