import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly contractInclude = {
    institution: {
      select: {
        id: true,
        name: true,
      },
    },
    pricingMode: {
      select: {
        id: true,
        name: true,
      },
    },
  } satisfies Prisma.ContractInclude;

  private handlePrismaError(error: unknown, fallbackMessage: string): never {
    if (error instanceof NotFoundException || error instanceof BadRequestException) {
      throw error;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Un contrat avec ce numero existe deja.');
      }

      if (error.code === 'P2003') {
        throw new BadRequestException(
          'La valeur de relation est invalide (institution ou mode de tarification).',
        );
      }

      if (error.code === 'P2025') {
        throw new NotFoundException('Contrat introuvable.');
      }
    }

    throw new InternalServerErrorException(fallbackMessage);
  }

  async findAll() {
    try {
      return await this.prisma.contract.findMany({
        orderBy: { id: 'desc' },
        include: this.contractInclude,
      });
    } catch (error) {
      this.handlePrismaError(error, 'Erreur lors de la recuperation des contrats.');
    }
  }

  async findOne(id: number) {
    try {
      const contract = await this.prisma.contract.findUnique({
        where: { id },
        include: this.contractInclude,
      });

      if (!contract) {
        throw new NotFoundException('Contrat introuvable.');
      }

      return contract;
    } catch (error) {
      this.handlePrismaError(error, 'Erreur lors de la recuperation du contrat.');
    }
  }

  async getLookups() {
    try {
      const [institutions, pricingModes] = await Promise.all([
        this.prisma.institution.findMany({
          orderBy: { name: 'asc' },
          select: { id: true, name: true },
        }),
        this.prisma.pricingMode.findMany({
          orderBy: { name: 'asc' },
          select: { id: true, name: true },
        }),
      ]);

      return { institutions, pricingModes };
    } catch (error) {
      this.handlePrismaError(error, 'Erreur lors du chargement des donnees de reference.');
    }
  }

  async create(payload: CreateContractDto) {
    try {
      return await this.prisma.contract.create({
        data: {
          institutionId: payload.institutionId,
          pricingModeId: payload.pricingModeId,
          contractNumber: payload.contractNumber,
          startDate: new Date(payload.startDate),
          endDate: new Date(payload.endDate),
          hourlyVolumePlanned: payload.hourlyVolumePlanned,
          unitPrice: payload.unitPrice,
        },
        include: this.contractInclude,
      });
    } catch (error) {
      this.handlePrismaError(error, 'Erreur lors de la creation du contrat.');
    }
  }

  async update(id: number, payload: UpdateContractDto) {
    try {
      const existing = await this.prisma.contract.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!existing) {
        throw new NotFoundException('Contrat introuvable.');
      }

      const updateData: Prisma.ContractUpdateInput = {};
      if (payload.institutionId !== undefined) {
        updateData.institution = { connect: { id: payload.institutionId } };
      }
      if (payload.pricingModeId !== undefined) {
        updateData.pricingMode = { connect: { id: payload.pricingModeId } };
      }
      if (payload.contractNumber !== undefined) {
        updateData.contractNumber = payload.contractNumber;
      }
      if (payload.startDate) {
        updateData.startDate = new Date(payload.startDate);
      }
      if (payload.endDate) {
        updateData.endDate = new Date(payload.endDate);
      }
      if (payload.hourlyVolumePlanned !== undefined) {
        updateData.hourlyVolumePlanned = payload.hourlyVolumePlanned;
      }
      if (payload.unitPrice !== undefined) {
        updateData.unitPrice = payload.unitPrice;
      }

      return await this.prisma.contract.update({
        where: { id },
        data: updateData,
        include: this.contractInclude,
      });
    } catch (error) {
      this.handlePrismaError(error, 'Erreur lors de la mise a jour du contrat.');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const existing = await this.prisma.contract.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!existing) {
        throw new NotFoundException('Contrat introuvable.');
      }

      await this.prisma.contract.delete({
        where: { id },
      });
    } catch (error) {
      this.handlePrismaError(error, 'Erreur lors de la suppression du contrat.');
    }
  }
}
