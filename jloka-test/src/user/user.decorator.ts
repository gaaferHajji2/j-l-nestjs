import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log(`The request is: ${request.path}`);
    const user = { id: 1, username: 'JLoka-01' }
    return data ? user[data] : user;
  },
);
