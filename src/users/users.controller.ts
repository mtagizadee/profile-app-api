import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';

export type FindUsersQuery = {
  firstName?: string;
  secondName?: string;
  take?: number;
  skip?: number;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async findAll(@Query() query: FindUsersQuery) {
    const users = await this.usersService.findAll(query);

    users.forEach(user => delete user.password);
    return users;
  }

  @Get('single-user/:id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);

    delete user.password;
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('current-user')
  findCurrentUser(@CurrentUser() user: User) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(@CurrentUser('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);

    delete user.password;
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  remove(@CurrentUser('id') id: string) {
    return this.usersService.remove(id);
  }
}
