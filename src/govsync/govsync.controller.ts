import { Controller } from '@nestjs/common';
import { GovsyncService } from './govsync.service';

@Controller('govsync')
export class GovsyncController {
  constructor(private readonly govsyncService: GovsyncService) {}
}
