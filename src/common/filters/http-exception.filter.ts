import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  ConflictException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(ConflictException)
export class ConflictExceptionFilter implements ExceptionFilter {
  catch(exception: ConflictException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    console.log('masuk ke sini');

    // * Extract the response details
    const { message, duplicateFields } = exception.getResponse() as any;

    response.status(status).json({
      statusCode: status,
      message,
      duplicateFields,
    });
  }
}
