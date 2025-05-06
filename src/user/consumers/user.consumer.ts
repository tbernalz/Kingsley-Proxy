import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

import { RABBITMQ_CONFIG } from '../../config/rabbitmq.constants';
import { UserService } from '../user.service';
import { UserRequestEventDto } from '../dto/user-request-event.dto';

@Injectable()
export class UserConsumer {
  private readonly logger = new Logger(UserConsumer.name);

  private static readonly userRequestQueue = RABBITMQ_CONFIG;

  constructor(private readonly userPublisher: UserService) {}

  @RabbitSubscribe({
    exchange: UserConsumer.userRequestQueue.exchanges.consumer.user,
    routingKey: UserConsumer.userRequestQueue.routingKeys.userRequest,
    queue: UserConsumer.userRequestQueue.queues.userRequest,
    queueOptions: {
      durable: true,
      deadLetterExchange: 'users_request_dlx',
      deadLetterRoutingKey: 'users_request.failed',
    },
    createQueueIfNotExists: true,
    allowNonJsonMessages: false,
  })
  async handleUserRequest(
    userRequestEventDto: UserRequestEventDto,
  ): Promise<void> {
    this.logger.log(
      `incoming message to the exchange: ${UserConsumer.userRequestQueue.exchanges.consumer.user} queue: ${JSON.stringify(UserConsumer.userRequestQueue.queues.userCreate)} with routingKey: ${UserConsumer.userRequestQueue.routingKeys.userCreate}`,
    );

    const userId = userRequestEventDto.headers?.userId;
    const operation = userRequestEventDto.headers?.eventType;
    const message = userRequestEventDto.payload;

    this.logger.log(
      `Received user request for userId: ${userId}, operation: ${operation}, message: ${message}`,
    );

    await this.userPublisher.handleUserEvents(userId, operation, message);
  }
}
