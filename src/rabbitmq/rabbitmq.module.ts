import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    RabbitMQModule.forRoot({
      exchanges: [
        { name: 'user_exchange', type: 'topic' },
        { name: 'operator_exchange', type: 'topic' },
        { name: 'document_exchange', type: 'topic' },
        { name: 'user_dlx', type: 'topic' }, // Dead letter exchanges
        { name: 'operator_dlx', type: 'topic' },
        { name: 'document_dlx', type: 'topic' },
      ],
      uri: process.env.RABBITMQ_URI || '',
    }),
  ],
  exports: [RabbitMQModule],
})
export class RabbitMQSharedModule {}
