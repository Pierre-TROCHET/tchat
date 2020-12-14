import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConversationDto } from '../models/conversation-dto';
import { TchatService } from '../services/tchat.service';
import { TokenService } from '../services/token.service';
import { WebsocketService } from '../services/websocket.service';

declare var $: any;

@Component({
  selector: 'app-my-conversations',
  templateUrl: './my-conversations.component.html',
  styleUrls: ['./my-conversations.component.css']
})
export class MyConversationsComponent implements OnInit, OnDestroy {

  myConversations: ConversationDto[];
  term: string;
  conversationId: number;

  constructor(private tchatService: TchatService, private  websocketService: WebsocketService, private tokenService: TokenService) { }
  
  ngOnDestroy():void{
    //On se désabonne de chque conversation du user
    this.myConversations.forEach((conversation, index) =>{
      this.websocketService.unsubscribeToWebSocketEvent('/topic/conversationLastMessage/'+conversation.id);
    });
  }

  ngOnInit(): void {
    //On va chercher les conversations du user
    this.tchatService.getMyConversations().subscribe(
      data => {
        //On met le résultat dans myConversations en le triant par date de création du message ou, 
        //si il n'y a pas de message par date de création de la conversation
        this.myConversations = data.sort((a,b) => {
          var dateA;
          if(a.messages != null){
            dateA = a.messages[0].creationDate;
          }else{
            dateA = a.creationDate;
          }
          var dateB;
          if(b.messages != null){
            dateB = b.messages[0].creationDate;
          }else{
            dateB = b.creationDate;
          }

          return <any>new Date(dateB) - <any>new Date(dateA);});

          this.myConversations.forEach(data => data.badgeCount=0);

          //On s'abonne pour chaque conversation à /topic/conversationLastMessage/{conversationid} pour avoir le dernier message dans la liste des conversations
          this.websocketService.initWebSocket().then(() => {
            this.myConversations.forEach((conversation) =>{
              this.websocketService.subscribe('/topic/conversationLastMessage/'+conversation.id, (event) => {               
                if(event.body.user.id == this.tokenService.getUserId()){
                  event.body.currentUser = true;
                }

                //Si il y a déjà un message on le remplace sinon on l'ajoute
                if(this.myConversations.find(conv => conv.id == conversation.id).messages != null){
                  this.myConversations.find(conv => conv.id == conversation.id).messages[0] = event.body;
                }else{
                  this.myConversations.find(conv => conv.id == conversation.id).messages = [event.body];
                }
                
                
                
                //Si le nouveau message reçu n'est pas celui de l'utilisateur courant 
                //et si l'utilisateur courant n'est pas dans la conversation en cours on ajoute une pastille à la conversation
                if(event.body.user.id != this.tokenService.getUserId() && ((sessionStorage.getItem("currentConversationId") != null 
                && +sessionStorage.getItem("currentConversationId") != conversation.id) || sessionStorage.getItem("currentConversationId") == null)){
                  this.myConversations.find(conv => conv.id == conversation.id).badgeCount++;
                }
                //On trie à nouveau les conversations par date pour avoir en premier la conversation la plus récente
                this.myConversations = data.sort((a,b) => {
                  var dateA;
                  if(a.messages != null){
                    dateA = a.messages[0].creationDate;
                  }else{
                    dateA = a.creationDate;
                  }
                  var dateB;
                  if(b.messages != null){
                    dateB = b.messages[0].creationDate;
                  }else{
                    dateB = b.creationDate;
                  }
                  return <any>new Date(dateB) - <any>new Date(dateA);});

              });
            });
          });
      },
      err => {
        console.log(err);
        $("#error-modal").modal();
      }
    );
  }

  showConversation(conversationId){
    //On remet badgeCount à 0
    this.myConversations.find(conv => conv.id == conversationId).badgeCount = 0;
    //On passe à conversationroom l'id de la conversation
    this.conversationId = conversationId;
    //Version mobile pour afficher la conversation
    document.querySelector('.main').classList.toggle('main-visible');
  }

}
