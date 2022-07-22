import { Challenge } from './interfaces/challenge.interface';
import { ClientProxyConnections } from './../rabbit-mq/client-proxy-connections';
import { Injectable, Logger } from '@nestjs/common';
import { RpcException, ClientProxy } from '@nestjs/microservices';
import { MailerService } from '@nestjs-modules/mailer';
import { firstValueFrom } from 'rxjs';
import HTML_NOTIFICACAO_ADVERSARIO from '../static/html-notification-opponent';
import { Player } from './interfaces/player.interface';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly clientAdminBackend: ClientProxy;

  constructor(
    private readonly clientProxyConnections: ClientProxyConnections,
    private readonly mailService: MailerService,
  ) {
    this.clientAdminBackend = this.clientProxyConnections.connectQueueAdmin();
  }

  async sendEmailToOpponent(challenge: Challenge): Promise<void> {
    try {
      const { players } = challenge;

      const idRequester = challenge.requester;
      const idOponnent = players.find((player) => player !== idRequester);

      const opponent: Player = await firstValueFrom(
        this.clientAdminBackend.send('get-player-by-id', idOponnent),
      );
      const requester: Player = await firstValueFrom(
        this.clientAdminBackend.send('get-player-by-id', idRequester),
      );

      const html = HTML_NOTIFICACAO_ADVERSARIO.replace(
        /#NOME_ADVERSARIO/g,
        opponent.name,
      ).replace(/#NOME_SOLICITANTE/g, requester.name);

      const sendedEmail = await this.mailService.sendMail({
        to: opponent.email,
        from: `"SMART RANKING" <mateusmendesm16@outlook.com>`,
        subject: 'Notificação de Desafio',
        html,
      });

      this.logger.log(sendedEmail);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
