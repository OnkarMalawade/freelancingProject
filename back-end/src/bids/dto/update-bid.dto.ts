import { PartialType } from '@nestjs/mapped-types';
import { CreateBidDto } from './create-bid.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { BidStatus } from '../entities/bid.entity';

export class UpdateBidDto extends PartialType(CreateBidDto) {
  @IsOptional()
  @IsEnum(BidStatus) // ghetln ki change kr
  status?: BidStatus;
}
