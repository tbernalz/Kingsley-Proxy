import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

import { RABBITMQ_CONFIG } from '../../config/rabbitmq.constants';
import { UserEventTypeEnum } from '../enum/user-event-type.enum';
import { UserRequestEventDto } from '../dto/user-request-event.dto';

@Injectable()
export class UserConsumer {
  private readonly logger = new Logger(UserConsumer.name);

  private static readonly userRequestQueue = RABBITMQ_CONFIG;

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
  async handleUserRequest(userRequestEventDto: UserRequestEventDto) {
    try {
      this.logger.log(
        `incoming message to the exchange: ${UserConsumer.userRequestQueue.exchanges.consumer.user} queue: ${JSON.stringify(UserConsumer.userRequestQueue.queues.userCreate)} with routingKey: ${UserConsumer.userRequestQueue.routingKeys.userCreate}`,
      );
      const userId = userRequestEventDto.headers?.userId;
      const operation = userRequestEventDto.headers?.eventType;
      const message = userRequestEventDto.payload;
      this.logger.log(
        `Received user request for userId: ${userId}, operation: ${operation}, message: ${message}`,
      );

      switch (operation) {
        case UserEventTypeEnum.VERIFY:

        case UserEventTypeEnum.CREATE:

        case UserEventTypeEnum.UNREGISTER:

        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }
    } catch (error) {
      this.logger.error(
        `Message processing in handleUserRequest failed: ${error.message}`,
        error.stack,
      );
    }
  }
}
