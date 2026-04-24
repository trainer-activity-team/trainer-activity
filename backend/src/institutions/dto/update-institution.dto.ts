import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateInstitutionDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsBoolean()
  @IsOptional()
  requiresDeclaration?: boolean;
}
