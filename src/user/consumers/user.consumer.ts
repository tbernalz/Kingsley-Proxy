import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

import { RABBITMQ_CONFIG } from '../../config/rabbitmq.constants';
import { UserService } from '../user.service';
import { UserRequestEventDto } from '../dto/user-request-event.dto';

@Injectable()
export class UserConsumer {
  private readonly logger = new Logger(UserConsumer.name);

  private static readonly rabbitmqConfig = RABBITMQ_CONFIG;

  constructor(private readonly userService: UserService) {}

  @RabbitSubscribe({
    exchange: UserConsumer.rabbitmqConfig.exchanges.consumer.user,
    routingKey: UserConsumer.rabbitmqConfig.routingKeys.userRequest,
    queue: UserConsumer.rabbitmqConfig.queues.userRequest,
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
      `incoming message to the exchange: ${UserConsumer.rabbitmqConfig.exchanges.consumer.user} queue: ${JSON.stringify(UserConsumer.rabbitmqConfig.queues.userRequest)} with routingKey: ${UserConsumer.rabbitmqConfig.routingKeys.userRequest}`,
    );

    const userId = userRequestEventDto.headers?.userId;
    const operation = userRequestEventDto.headers?.eventType;
    const message = userRequestEventDto.payload;

    this.logger.log(
      `Received user request for userId: ${userId}, operation: ${operation}, message: ${JSON.stringify(message)}`,
    );

    await this.userService.handleUserEvents(userId, operation, message);
  }
}
