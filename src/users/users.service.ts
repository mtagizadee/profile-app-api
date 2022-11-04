import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { v6 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) { }

  async create(createUserDto: CreateUserDto) {
    const id: string = v6();
    try {
      const user = this.usersRepository.create({ ...createUserDto, id });
      return await this.usersRepository.save(user);
    } catch (error) {
      // TODO: add error handling (if email is repeated case)
      throw error
    }
  }

  async findAll() {
    const users = await this.usersRepository.find();
    if (!users || users.length == 0) throw new NotFoundException('Users are not found');
    return users;
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User is not found');
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
