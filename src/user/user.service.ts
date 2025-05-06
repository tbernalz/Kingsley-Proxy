import { Injectable, Logger } from '@nestjs/common';
import { GovsyncService } from 'src/govsync/govsync.service';
import { UserEventTypeEnum } from './enum/user-event-type.enum';
import { UserRequestEventDto } from './dto/user-request-event.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly govsyncService: GovsyncService) {}

  async handleUserEvents(
    userId: UserRequestEventDto['headers']['userId'],
    operation: UserRequestEventDto['headers']['eventType'],
    message: UserRequestEventDto['payload'],
  ): Promise<void> {
    try {
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
