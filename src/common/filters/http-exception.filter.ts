import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  ConflictException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../utils/api-response';

// * for conflict only
@Catch(ConflictException)
export class ConflictExceptionFilter implements ExceptionFilter {
  catch(exception: ConflictException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const { message, duplicateFields } = exception.getResponse() as any; // * Extract the response details

    response.status(status).json({
      error: true,
      statusCode: status,
      message,
      duplicateFields,
    });
  }
}

// * for all error
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const apiResponse = new ApiResponse(
      false,
      exception instanceof HttpException
        ? (exception.getResponse() as { message: string }).message
        : 'Internal Server Error',
      null,
      exception instanceof HttpException ? exception.getResponse() : {},
    );

    response.status(status).json(apiResponse);
  }
}
