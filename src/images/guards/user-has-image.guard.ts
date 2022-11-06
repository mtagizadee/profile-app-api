
import { Injectable, CanActivate, ExecutionContext, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/users/entities/user.entity';
import { Request } from 'express';

@Injectable()
export class UserHasImageGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest() as Request;
        const id = request.params.id;
        if (!id || !parseInt(id)) throw new BadRequestException('Request params are wrong.');

        const user = request.user as User;
        const userHasImage = user.images.some(image => image.id == parseInt(request.params.id));

        if (!userHasImage) throw new ForbiddenException('User can not mofidy an image that does not belong to him.')
        return true;
    }
}
