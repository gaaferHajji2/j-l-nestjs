import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const Roles = Reflector.createDecorator<String[]>()
