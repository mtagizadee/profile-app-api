import { Injectable, ForbiddenException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { verify } from 'argon2';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';

export type JwtPayload = {
    sub: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async login(loginUserDto: LoginUserDto) {
        try {
            const user = await this.usersService.findOneByEmail(loginUserDto.email);
            const isPasswordRight = await verify(user.password, loginUserDto.password);
            if (!isPasswordRight) throw new ForbiddenException('Wrong password.');
            const payload: JwtPayload = { sub: user.id }
            return {
                access_token: this.jwtService.sign(payload, {
                    secret: process.env.JWT_SECRET,
                    expiresIn: '1d'
                })
            }
        } catch (error) {
            throw error;
        }
    }

    async signup(createUserDto: CreateUserDto) {
        try {
            await this.usersService.create(createUserDto);
            return { message: 'User successfully created.' }
        } catch (error) {
            throw error;
        }
    }
}
