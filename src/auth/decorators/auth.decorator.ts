import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Injectable } from '@nestjs/common';

export const Auth = () => UseGuards(AuthGuard('jwt'))



@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    // Если юзера нет — возвращаем null, а не ошибку
    return user ?? null;
  }
}
