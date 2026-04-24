import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class ContractIdDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  contractId: number;
}
