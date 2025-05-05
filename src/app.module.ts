import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GovsyncModule } from './govsync/govsync.module';
import { RabbitMQSharedModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GovsyncModule,
    RabbitMQSharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
