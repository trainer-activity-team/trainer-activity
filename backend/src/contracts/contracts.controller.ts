import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ContractIdDto } from './dto/contract-id.dto';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { UpdateContractRequestDto } from './dto/update-contract-request.dto';
import { ContractsService } from './contracts.service';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get()
  findAll() {
    return this.contractsService.findAll();
  }

  @Get('lookups')
  getLookups() {
    return this.contractsService.getLookups();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contractsService.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateContractDto) {
    return this.contractsService.create(payload);
  }

  @Patch()
  update(@Body() payload: UpdateContractRequestDto) {
    const { contractId, ...updatePayload } = payload;
    return this.contractsService.update(contractId, updatePayload as UpdateContractDto);
  }

  @Delete()
  remove(@Body() payload: ContractIdDto) {
    return this.contractsService.remove(payload.contractId);
  }
}
