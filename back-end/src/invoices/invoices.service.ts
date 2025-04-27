// src/invoices/invoices.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { MilestonesService } from '../milestones/milestones.service';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
    private milestonesService: MilestonesService,
    private projectsService: ProjectsService,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto, userId: string) {
    // Get the milestone
    const milestone = await this.milestonesService.findOne(
      createInvoiceDto.milestoneId,
    );

    // Get the project to check if user is the client
    const project = await this.projectsService.findOne(milestone.projectId);

    if (project.clientId !== userId) {
      throw new ForbiddenException('Only the client can create invoices');
    }

    // Ensure milestone is completed before creating invoice
    if (milestone.status !== 'completed') {
      throw new ForbiddenException(
        'Cannot create invoice for milestone that is not completed',
      );
    }

    // Check if invoice already exists for this milestone
    const existingInvoice = await this.invoicesRepository.findOne({
      where: { milestoneId: milestone.milestoneId },
    });

    if (existingInvoice) {
      throw new ForbiddenException('Invoice already exists for this milestone');
    }

    const invoice = this.invoicesRepository.create({
      milestoneId: milestone.milestoneId,
      clientId: project.clientId,
      freelancerId: project.assignedFreelancerId,
    });

    return this.invoicesRepository.save(invoice);
  }

  async findAll(userId: string, role: string) {
    if (role === 'client') {
      return this.invoicesRepository.find({
        where: { clientId: userId },
        relations: ['milestone'],
      });
    } else if (role === 'freelancer') {
      return this.invoicesRepository.find({
        where: { freelancerId: userId },
        relations: ['milestone'],
      });
    }
    return [];
  }

  async findOne(id: string, userId: string) {
    const invoice = await this.invoicesRepository.findOne({
      where: { invoiceId: id },
      relations: ['milestone'],
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    if (invoice.clientId !== userId && invoice.freelancerId !== userId) {
      throw new ForbiddenException('You do not have access to this invoice');
    }

    return invoice;
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto, userId: string) {
    const invoice = await this.findOne(id, userId);

    // Only client can mark invoice as paid
    if (invoice.clientId !== userId) {
      throw new ForbiddenException(
        'Only the client can update invoice payment status',
      );
    }

    await this.invoicesRepository.update(id, updateInvoiceDto);

    // If marking as paid, update milestone status to approved
    if (updateInvoiceDto.isPaid) {
      await this.milestonesService.updateStatus(
        invoice.milestoneId,
        'approved',
        userId,
      );
    }

    return this.findOne(id, userId);
  }
}
