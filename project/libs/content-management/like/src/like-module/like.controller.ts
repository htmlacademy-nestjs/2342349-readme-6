import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LikeService } from './like.service';

@ApiTags('like')
@Controller('like')
export class LikeController {
  constructor(
    private readonly likeService: LikeService
  ) {
  }

  

}
