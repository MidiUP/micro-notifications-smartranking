import { RabbitMqModule } from './../rabbit-mq/rabbit-mq.module';
import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  imports: [RabbitMqModule],
})
export class NotificationsModule {}
