import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';
import { UpdateContractDto } from './update-contract.dto';

export class UpdateContractRequestDto extends UpdateContractDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  contractId: number;
}
