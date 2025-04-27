import { PartialType } from '@nestjs/mapped-types';
import { CreateBidDto } from './create-bid.dto';

export class UpdateBidDto extends PartialType(CreateBidDto) {
  // These will be removed in service
  projectId?: string;
  freelancerId?: string;
}
