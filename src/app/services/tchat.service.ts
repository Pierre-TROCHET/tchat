import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDto } from "../models/user-dto";
import { environment } from '../../environments/environment';
import { ConversationDto } from '../models/conversation-dto';

const header = {headers: new HttpHeaders({'Content-Type' : 'application/json'})};

@Injectable({
  providedIn: 'root'
})
export class TchatService {

  constructor(private httpClient: HttpClient) { }

  public getMyInformations(): Observable<UserDto>{
    return this.httpClient.get<UserDto>(environment.urlBack + 'getmyinformations', header);
  }

  public getAllUsersButNotMe(): Observable<UserDto[]>{
    return this.httpClient.get<UserDto[]>(environment.urlBack + 'getallusersbutnotme', header);
  }
  
  public addConversation(conversationDto: ConversationDto): Observable<ConversationDto>{
    return this.httpClient.post<ConversationDto>(environment.urlBack + 'addconversation', conversationDto);
  }

  public getMyConversations(): Observable<ConversationDto[]>{
    return this.httpClient.get<ConversationDto[]>(environment.urlBack + 'getmyconversations', header);
  }

  public getFullConversation(convId:string): Observable<ConversationDto>{
    return this.httpClient.get<ConversationDto>(environment.urlBack + 'getfullconversation?conversationid='+convId, header);
  }

  public getAllUsersButConversation(convId:number): Observable<UserDto[]>{
    return this.httpClient.get<UserDto[]>(environment.urlBack + 'getallusersbutconversation?conversationid='+convId, header);
  }

  public addUserInConversation(convId:string, userId:number): Observable<ConversationDto>{
    return this.httpClient.get<ConversationDto>(environment.urlBack + 'adduserinconversation?conversationid='+convId+'&userid='+userId, header);
  }

  public getAllUsers(): Observable<UserDto[]>{
    return this.httpClient.get<UserDto[]>(environment.urlBack + 'getallusers', header);
  }

  
}
