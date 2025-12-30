import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class GeneratePersonaRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'Article text cannot be empty' })
  @MinLength(500, { message: 'Article text must be at least 500 characters (approximately 100 words)' })
  @MaxLength(50000, { message: 'Article text must not exceed 50,000 characters (approximately 10,000 words)' })
  articleText: string;

  @IsString()
  @IsNotEmpty({ message: 'Design brief cannot be empty' })
  @MinLength(10, { message: 'Design brief must be at least 10 characters' })
  designBrief: string;
}
