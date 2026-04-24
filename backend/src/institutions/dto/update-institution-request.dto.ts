import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';
import { UpdateInstitutionDto } from './update-institution.dto';

export class UpdateInstitutionRequestDto extends UpdateInstitutionDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  institutionId: number;
}
