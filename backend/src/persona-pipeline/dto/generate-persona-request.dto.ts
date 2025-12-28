import { IsString, IsNotEmpty, MinLength, Matches, IsUrl } from 'class-validator';

export class GeneratePersonaRequestDto {
  @IsUrl({}, { message: 'Invalid URL format' })
  @Matches(/linkedin\.com\/in\/[a-zA-Z0-9-]+/, {
    message: 'Must be a valid LinkedIn profile URL',
  })
  linkedinUrl: string;

  @IsString()
  @IsNotEmpty({ message: 'Design brief cannot be empty' })
  @MinLength(10, { message: 'Design brief must be at least 10 characters' })
  designBrief: string;
}
