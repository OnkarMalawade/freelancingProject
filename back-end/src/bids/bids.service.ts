import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bid, BidStatus } from './entities/bid.entity';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid)
    private readonly bidRepository: Repository<Bid>,
  ) {}

  async create(createBidDto: CreateBidDto) {
    const bid = this.bidRepository.create(createBidDto);
    return await this.bidRepository.save(bid);
  }

  async findAll() {
    return await this.bidRepository.find();
  }

  async findOne(id: number) {
    return await this.bidRepository.findOneBy({ id });
  }

  async findByProject(project_id: number) {
    return await this.bidRepository.find({ where: { project_id } });
  }

  async update(id: number, updateBidDto: UpdateBidDto) {
    await this.bidRepository.update(id, updateBidDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.bidRepository.delete(id);
  }

  async acceptBid(id: number) {
    const bid = await this.findOne(id);
    if (!bid) throw new Error('Bid not found');

    // Accept this bid
    bid.status = BidStatus.ACCEPTED;
    await this.bidRepository.save(bid);

    // Reject all other bids for this project
    await this.bidRepository
      .createQueryBuilder()
      .update(Bid)
      .set({ status: BidStatus.REJECTED })
      .where('project_id = :projectId', { projectId: bid.project_id })
      .andWhere('id != :bidId', { bidId: id })
      .execute();

    return bid;
  }
}
