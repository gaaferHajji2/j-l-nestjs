import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from "@nestjs/common";
import { Request, Response } from 'express'
import { I18nContext, I18nService } from "nestjs-i18n";

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {

    constructor(private readonly service: I18nService) {}

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const context = I18nContext.current();

    const exceptionResponse = exception.getResponse() as any;
    
    // console.log("Stack is: ", exception.stack)
    console.log("The errors: ", exceptionResponse.message)
    console.log("The error: ", exceptionResponse.error)
    console.log("The context: ", Object.keys(exceptionResponse))
    console.log("Lang is: ", this.service.getSupportedLanguages())
    console.log("current: ", context?.lang)
    console.log("Test-01: ", this.service.t(`validation.IS_EMAIL`))

    response.status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
