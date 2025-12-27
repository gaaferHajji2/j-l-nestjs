import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflactor: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflactor.get(Roles, context.getHandler())
    if(!roles) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const t1 = request.headers['roles']
    console.log("the roles of the user is: ", t1)
    return true;
  }
}