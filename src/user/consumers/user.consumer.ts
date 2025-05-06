import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

import { RABBITMQ_CONFIG } from '../../config/rabbitmq.constants';
import { GovsyncService } from 'src/govsync/govsync.service';
import { UserEventTypeEnum } from '../enum/user-event-type.enum';
import { UserRequestEventDto } from '../dto/user-request-event.dto';

@Injectable()
export class UserConsumer {
  private readonly logger = new Logger(UserConsumer.name);

  private static readonly userRequestQueue = RABBITMQ_CONFIG;

  constructor(private readonly govsyncService: GovsyncService) {}

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
          const response = await this.govsyncService.handleVerifyUser(userId);
          if (response.statusCode == 200) {
            const currentUserOperador = response.message
              .split('operador: ')[1]
              .trim();
            // async communication with notify microservice to send an email to the user saying that's already sync with the operator currentUserOperador
            // async communication with user microservice to delete that user from the user DB
          } else {
            // async communication with the notify auth microservice to send an email to the user to set the password
            // when the user completes the password set in FireBase Auth, it will call a user microservice webhook to to update that user from the user DB (active: true, GovCarpetaVerified: true)
          }

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
