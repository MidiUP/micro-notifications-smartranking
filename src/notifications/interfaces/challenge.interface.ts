import { ChallengeStatus } from '../enums/challenge-status.enum';

export interface Challenge {
  dateHourChallenge: Date;
  status: ChallengeStatus;
  dateHourRequest: Date;
  dateHourResponse: Date;
  requester: string;
  category: string;
  players: string[];
  match?: string;
}
