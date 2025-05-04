import { Module } from '@nestjs/common';
import { GovsyncService } from './govsync.service';
import { GovsyncController } from './govsync.controller';

@Module({
  controllers: [GovsyncController],
  providers: [GovsyncService],
})
export class GovsyncModule {}
