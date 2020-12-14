import { MessageDto } from './message-dto';
import { UserDto } from './user-dto';

export class ConversationDto {
    id: number;
    name: string;
    creationDate: Date;
    users: UserDto[];
    messages: MessageDto[];
    badgeCount: number;

    constructor() {
    }
}