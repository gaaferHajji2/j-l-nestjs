import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from "@nestjs/common";
import { Request, Response } from 'express'
import { I18nService } from "nestjs-i18n";

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {

    constructor(private readonly service: I18nService) {}

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;
    
    let errors = exceptionResponse.message;
    if(Array.isArray(errors)) {
      errors = errors.map(error => {
        if(error.startsWith("extra.")){
          error = error.split("extra.")[1]
        }
        return this.service.translate(error, { lang: request.query['lang'] as string || 'en'})
      })
    } else {
      errors = this.service.translate(errors, { lang: request.query['lang'] as string || 'en'})
    }

    response.status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        errors
      });
  }
}