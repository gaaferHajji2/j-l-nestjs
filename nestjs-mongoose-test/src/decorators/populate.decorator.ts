import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface PopulateConfig {
  [key: string]: boolean | PopulateConfig;
}

export const Populate = createParamDecorator(
  (data: PopulateConfig, ctx: ExecutionContext): PopulateConfig => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;
    
    // Parse populate parameters from query string
    const populateConfig: PopulateConfig = {};
    
    Object.keys(data).forEach(key => {
      if (query[`populate${key.charAt(0).toUpperCase() + key.slice(1)}`] === 'true') {
        populateConfig[key] = true;
      }
    });
    
    return populateConfig;
  },
);