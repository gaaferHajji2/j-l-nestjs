import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log(`The request is: ${request.path}`);
    return { id: 1, username: 'JLoka-01' };
  },
);
