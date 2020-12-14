import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { ConversationDto } from '../models/conversation-dto';
import { TchatService } from '../services/tchat.service';
import { UserDto } from '../models/user-dto';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WebsocketService } from '../services/websocket.service';
import { TokenService } from '../services/token.service';
import { ActivatedRoute } from '@angular/router';

const CURRENT_CONV_ID = 'currentConversationId';
declare function myFunction(): any;
declare var $: any;

@Component({
  selector: 'app-conversation-room',
  templateUrl: './conversation-room.component.html',
  styleUrls: ['./conversation-room.component.css']
})
export class ConversationRoomComponent implements OnInit,OnChanges,OnDestroy, AfterViewChecked {

  @Input('currentConversation') currentConversationId;
  conversation: ConversationDto;
  otherUsers: UserDto[];
  formAddUser: FormGroup;
  submitOtherUsersOk: boolean=false;
  term: string;
  firstLoad: boolean=true;
  chatMessage: string;

  //Scroll tchat
  @ViewChild('scrollMe') container: ElementRef;

  constructor(private route:ActivatedRoute, private tchatService: TchatService, private fb: FormBuilder, private  websocketService: WebsocketService, private tokenService: TokenService) {   
    this.formAddUser = this.fb.group({
      userToAdd: [''],
  })}

  ngOnDestroy():void{
    //On se désabonne de la conversation courante
    this.websocketService.unsubscribeToWebSocketEvent('/topic/conversationroom/'+this.getCurrentConv());
  }

  //A l'initialisation du composant, si une conversation est en session on l'affiche
  //Pratique pour le changement de page
  ngOnInit(): void {
    if(this.getCurrentConv() != null){


      this.tchatService.getFullConversation(this.getCurrentConv()).subscribe(
        data => {
          this.conversation = data;
          this.conversation.messages = this.conversation.messages.sort((a,b) => a.id - b.id);    
          
          //Websockets
          //On s'abonne à la nouvelle conversation
          this.websocketService.initWebSocket().then(() => {
            this.websocketService.subscribe('/topic/conversationroom/'+this.conversation.id, (event) => { 
              if(event.body.user.id == this.tokenService.getUserId()){
                event.body.currentUser = true;
              }
              this.conversation.messages.push(event.body);
            });
          });

          this.tchatService.getAllUsersButConversation(this.conversation.id).subscribe(
            data => {
              this.otherUsers = data;
              //Version mobile pour afficher la conversation si on vient de créer une conversation
              if(this.route.snapshot.paramMap.get('creation')){
                document.querySelector('.main').classList.toggle('main-visible');
              }
              myFunction();
            },
            err => {
              $("#error-modal").modal();
              console.log(err);
            }
          );
        },
        err => {
          $("#error-modal").modal();
          console.log(err);
        }
      );
    }
  }

  //A chaque changement de currentConversationId on le met en session et on va chercher la conversation demandée
  ngOnChanges(changes: SimpleChanges): void {

    for (const propName in changes) {
      if(propName == "currentConversationId"){
        const changedProp = changes[propName];
        const to = JSON.stringify(changedProp.currentValue);
        if (!changedProp.isFirstChange()) {

          //On se désabonne de la conversation précédente
          this.websocketService.unsubscribeToWebSocketEvent('/topic/conversationroom/'+this.getCurrentConv());

          this.setCurrentConv(to);    
          this.tchatService.getFullConversation(this.getCurrentConv()).subscribe(
            data => {
              this.conversation = data;
              this.conversation.messages = this.conversation.messages.sort((a,b) => a.id - b.id);    
          
              //Websockets
              this.websocketService.initWebSocket().then(() => {
                this.websocketService.subscribe('/topic/conversationroom/'+this.conversation.id, (event) => { 
                  if(event.body.user.id == this.tokenService.getUserId()){
                    event.body.currentUser = true;
                  }
                  this.conversation.messages.push(event.body);
                });
              });
              
              if(this.getFirstLoad()==null){
                myFunction();
                this.setFirstLoad();
              }
              this.tchatService.getAllUsersButConversation(this.conversation.id).subscribe(
                data => {
                  this.otherUsers = data;
                  this.submitOtherUsersOk = false;
                  this.formAddUser.reset();
                },
                err => {
                  $("#error-modal").modal();
                  console.log(err);
                }
              );
              //myFunction();
              //console.log("ngOnChanges: myFunction()");
            },
            err => {
              $("#error-modal").modal();
              console.log(err);
            }
          );
        }
      }
    }

  }

  public getCurrentConv(): string {
    return sessionStorage.getItem(CURRENT_CONV_ID);
  }

  public setCurrentConv(currentConversationId: string): void {
    sessionStorage.removeItem(CURRENT_CONV_ID);
    sessionStorage.setItem(CURRENT_CONV_ID, currentConversationId);
  }

  public getFirstLoad(): string {
    return sessionStorage.getItem("FIRST_LOAD");
  }

  public setFirstLoad(): void {
    sessionStorage.removeItem("FIRST_LOAD");
    sessionStorage.setItem("FIRST_LOAD", "OK");
  }

  submitForm(){
    this.submitOtherUsersOk = false;
    this.tchatService.addUserInConversation(this.getCurrentConv(),this.formAddUser.value.userToAdd).subscribe(
    data => {
      this.conversation.users = data.users;
      
      this.otherUsers.forEach((currentOtherUser, index) => {
        if(currentOtherUser.id == this.formAddUser.value.userToAdd){
            this.otherUsers.splice(index, 1);
        }
      });
    },
    err => {
      $("#error-modal").modal();
      console.log(err);
    });
  }

  onChatSubmit() {
    this.websocketService.send('/app/conversationroom/'+this.conversation.id+'/userid/'+
    this.tokenService.getUserId(), this.chatMessage);
    this.chatMessage='';
  }

  private scrollToBottom() {
    try{
      this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight;
    }catch(err) { }   
  }
  ngAfterViewChecked() {        
      this.scrollToBottom();    
  }
}
