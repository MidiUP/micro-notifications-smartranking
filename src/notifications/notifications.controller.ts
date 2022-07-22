import { NotificationsService } from './notifications.service';
import { ackMessage, ackMessageError } from './../common/utils/ackMessages';
import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Challenge } from './interfaces/challenge.interface';

const ackErrors: string[] = ['E11000', 'Cast to ObjectId failed for value'];

@Controller()
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern('notification-new-challenge')
  async notificationNewChallenge(
    @Payload() challenge: Challenge,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    try {
      await this.notificationsService.sendEmailToOpponent(challenge);
      await ackMessage(context);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      await ackMessageError(ackErrors, error, context);
    }
  }
}
