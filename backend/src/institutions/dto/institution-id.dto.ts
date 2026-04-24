import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class InstitutionIdDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  institutionId: number;
}
