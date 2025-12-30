import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { PersonaPipelineService } from './persona-pipeline.service';
import { GeneratePersonaRequestDto } from './dto/generate-persona-request.dto';
import { GeneratePersonaResponseDto } from './dto/generate-persona-response.dto';
import { ErrorResponseDto } from './dto/error-response.dto';
import { v4 as uuidv4 } from 'uuid';

@Controller('api/persona')
export class PersonaPipelineController {
  private readonly logger = new Logger(PersonaPipelineController.name);

  constructor(private readonly personaPipelineService: PersonaPipelineService) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  async generatePersona(
    @Body() request: GeneratePersonaRequestDto,
  ): Promise<GeneratePersonaResponseDto> {
    const requestId = uuidv4();
    this.logger.log(`[${requestId}] Received persona generation request`);
    this.logger.debug(
      `[${requestId}] Article text length: ${request.articleText.length} characters, Brief length: ${request.designBrief.length}`,
    );

    try {
      // Call the pipeline service to generate the persona
      const result = await this.personaPipelineService.generatePersona(
        request.articleText,
        request.designBrief,
      );

      this.logger.log(
        `[${requestId}] Persona generation successful in ${result.processingTime}ms`,
      );

      return result;
    } catch (error) {
      this.logger.error(
        `[${requestId}] Persona generation failed: ${error.message}`,
        error.stack,
      );

      // Determine appropriate HTTP status code and error response
      const errorResponse = this.handleError(error, requestId);
      throw errorResponse;
    }
  }

  /**
   * Handle errors and return appropriate HTTP exceptions
   * @param error The error that occurred
   * @param requestId The request ID for tracking
   * @returns HttpException with appropriate status code and error details
   */
  private handleError(error: Error, requestId: string): HttpException {
    const timestamp = new Date().toISOString();
    const message = error.message.toLowerCase();

    // Rate limit errors (429 Too Many Requests)
    if (message.includes('rate limit') || message.includes('quota')) {
      const errorResponse: ErrorResponseDto = {
        error: 'Rate limit exceeded',
        code: 'RATE_LIMIT_EXCEEDED',
        details: 'Please try again later',
        timestamp,
        requestId,
      };
      return new HttpException(errorResponse, HttpStatus.TOO_MANY_REQUESTS);
    }

    // Authentication/API key errors (503 Service Unavailable)
    if (
      message.includes('api key') ||
      message.includes('authentication') ||
      message.includes('unauthorized')
    ) {
      const errorResponse: ErrorResponseDto = {
        error: 'External service authentication failed',
        code: 'SERVICE_AUTH_FAILED',
        details: 'AI service temporarily unavailable',
        timestamp,
        requestId,
      };
      return new HttpException(errorResponse, HttpStatus.SERVICE_UNAVAILABLE);
    }

    // External service errors (503 Service Unavailable)
    if (
      message.includes('gemini') ||
      message.includes('elevenlabs') ||
      message.includes('timeout') ||
      message.includes('network') ||
      message.includes('unavailable')
    ) {
      const errorResponse: ErrorResponseDto = {
        error: 'External service temporarily unavailable',
        code: 'SERVICE_UNAVAILABLE',
        details: 'AI service temporarily unavailable. Please try again.',
        timestamp,
        requestId,
      };
      return new HttpException(errorResponse, HttpStatus.SERVICE_UNAVAILABLE);
    }

    // Validation errors (400 Bad Request)
    if (message.includes('validation') || message.includes('invalid')) {
      const errorResponse: ErrorResponseDto = {
        error: 'Invalid request data',
        code: 'VALIDATION_ERROR',
        details: error.message,
        timestamp,
        requestId,
      };
      return new HttpException(errorResponse, HttpStatus.BAD_REQUEST);
    }

    // Generic server error (500 Internal Server Error)
    const errorResponse: ErrorResponseDto = {
      error: 'An unexpected error occurred',
      code: 'INTERNAL_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp,
      requestId,
    };
    return new HttpException(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
