import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenDto } from '../models/token-dto';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const header = {headers: new HttpHeaders({'Content-Type' : 'application/json'})};


@Injectable({
  providedIn: 'root'
})
export class OauthService {


  constructor(private httpClient: HttpClient) { }

  public google(tokenDto: TokenDto): Observable<TokenDto> {
    return this.httpClient.post<TokenDto>(environment.urlBack + 'oauth/google', tokenDto, header);
  }

  public facebook(tokenDto: TokenDto): Observable<TokenDto> {
    return this.httpClient.post<TokenDto>(environment.urlBack + 'oauth/facebook', tokenDto, header);
  }
}
