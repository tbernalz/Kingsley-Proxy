import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GovsyncService } from './govsync.service';
import { GovsyncController } from './govsync.controller';
import { RabbitMQSharedModule } from 'src/rabbitmq/rabbitmq.module';

@Module({
  imports: [HttpModule, RabbitMQSharedModule],
  controllers: [GovsyncController],
  providers: [GovsyncService],
  exports: [GovsyncService],
})
export class GovsyncModule {}
