export class UserDto {
    id: number;
    name: string;
    pictureUrl: string;
    creationDate: Date;  
    email: string;
    provider: string;
    providerId: string;

    constructor() {
    }
}