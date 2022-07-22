import { Module } from '@nestjs/common';
import { RabbitMqModule } from './rabbit-mq/rabbit-mq.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MailerModule } from '@nestjs-modules/mailer';
import 'dotenv/config';

@Module({
  imports: [
    RabbitMqModule,
    NotificationsModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        tls: {
          ciphers: 'SSLv3',
        },
        auth: {
          user: process.env.USER_SMTP,
          pass: process.env.PASSWORD_SMTP,
        },
      },
    }),
    // MailerModule.forRoot({
    //   transport: {
    //     host: 'email-smtp.us-east-1.amazonaws.com',
    //     port: 587,
    //     secure: false,
    //     tls: {
    //       ciphers: 'SSLv3',
    //     },
    //     auth: {
    //       user: process.env.USER_SMTP,
    //       pass: process.env.PASSWORD_SMTP,
    //     },
    //   },
    // }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
