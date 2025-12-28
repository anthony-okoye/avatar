export class ErrorResponseDto {
  error: string;
  code: string;
  details?: string;
  timestamp: string;
  requestId: string;
}
