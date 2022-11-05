import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { v4 } from 'uuid';
import { FindUsersQuery } from './users.controller';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) { }

  async create(createUserDto: CreateUserDto) {
    const id: string = v4();
    try {
      const user = this.usersRepository.create({ ...createUserDto, id });
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') throw new ConflictException('User already exist.');
      throw error
    }
  }

  async findAll(query: FindUsersQuery) {
    const { take, skip, ...rest } = query;
    const users = await this.usersRepository.find({
      where: { ...rest },
      take, skip
    });
    if (!users || users.length == 0) throw new NotFoundException('Users are not found.');
    return users;
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User is not found.');
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) throw new NotFoundException('User is not found.');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.findOne(id);
      Object.assign(user, updateUserDto);
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') throw new ConflictException('User with such email already exist.');
      throw error;
    }
  }

  async remove(id: string) {
    const deleteResult = await this.usersRepository.delete({ id });
    if (!deleteResult || deleteResult.affected == 0) throw new BadRequestException('Could not delete a user.');
    return { message: 'Successfully deleted a user.' };
  }
}
