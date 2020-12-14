import { Injectable } from '@angular/core';

const TOKEN_KEY = 'AuthToken';
const USER_ID = 'UserId';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public setToken(token: string): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getUserId(): string {
    return sessionStorage.getItem(USER_ID);
  }

  public setUserId(userid: string): void {
    sessionStorage.removeItem(USER_ID);
    sessionStorage.setItem(USER_ID, userid);
  }

  logOut(): void {
    sessionStorage.clear();
  }
}
