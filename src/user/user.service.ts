import { Injectable, Logger } from '@nestjs/common';
import { RABBITMQ_CONFIG } from 'src/config/rabbitmq.constants';
import { GovsyncService } from 'src/govsync/govsync.service';
import { UserPublisher } from './publishers/user.publisher';
import { UserEventTypeEnum } from './enum/user-event-type.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRequestEventDto } from './dto/user-request-event.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private static readonly rabbitmqConfig = RABBITMQ_CONFIG;

  constructor(
    private readonly govsyncService: GovsyncService,
    private readonly userPublisher: UserPublisher,
  ) {}

  async handleUserEvents(
    userId: UserRequestEventDto['headers']['userId'],
    operation: UserRequestEventDto['headers']['eventType'],
    message: UserRequestEventDto['payload'],
  ): Promise<void> {
    try {
      switch (operation) {
        case UserEventTypeEnum.VERIFY:
          await this.verifyUser(userId, message);
          break;

        case UserEventTypeEnum.UNREGISTER:
          break;

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

  async verifyUser(
    userId: UserRequestEventDto['headers']['userId'],
    createUserDto: CreateUserDto,
  ) {
    const response = await this.govsyncService.handleVerifyUser(userId);
    console.log(response);
    if (response.statusCode == 200) {
      const currentUserOperador = response.message
        .split('operador: ')[1]
        .trim();

      const notificationMessage: UserRequestEventDto['payload'] = {
        email: createUserDto.email,
        name: currentUserOperador,
      };

      const headers: UserRequestEventDto['headers'] = {
        userId: userId,
        eventType: UserEventTypeEnum.EXISTS_ON_OTHER_PROVIDER,
        timestamp: new Date().toISOString(),
      };

      await this.userPublisher.publishUserEvent(
        UserService.rabbitmqConfig.exchanges.publisher.notification,
        UserService.rabbitmqConfig.routingKeys.notificationRequest,
        notificationMessage,
        headers,
      );
    } else if (response.statusCode == 204) {
      const authMessage: UserRequestEventDto['payload'] = {
        email: createUserDto.email,
      };
      const authHeaders: UserRequestEventDto['headers'] = {
        userId: userId,
        eventType: UserEventTypeEnum.FIRST_SIGNIN,
        timestamp: new Date().toISOString(),
      };
      await this.userPublisher.publishUserEvent(
        UserService.rabbitmqConfig.exchanges.publisher.auth,
        UserService.rabbitmqConfig.routingKeys.authRequest,
        authMessage,
        authHeaders,
      );

      const { statusCode } =
        await this.govsyncService.handleCreateUser(createUserDto);

      if (statusCode == 201) {
        const userMessage: UserRequestEventDto['payload'] = {
          email: createUserDto.email,
        };

        const userHeaders: UserRequestEventDto['headers'] = {
          userId: userId,
          eventType: UserEventTypeEnum.CREATE,
          timestamp: new Date().toISOString(),
        };
        await this.userPublisher.publishUserEvent(
          UserService.rabbitmqConfig.exchanges.publisher.user,
          UserService.rabbitmqConfig.routingKeys.userRequest,
          userMessage,
          userHeaders,
        );
      }
    }
  }
}
