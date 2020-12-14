import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { MenuComponent } from './menu/menu.component';
import { ProfilComponent } from './profil/profil.component';
import { tchatInterceptor } from './interceptors/tchat.interceptor';
import { HomeComponent } from './home/home.component';
import { CreateConversationComponent } from './create-conversation/create-conversation.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MyConversationsComponent } from './my-conversations/my-conversations.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ConversationRoomComponent } from './conversation-room/conversation-room.component';
import { WebsocketService } from './services/websocket.service';
import { AllUsersComponent } from './all-users/all-users.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    ProfilComponent,
    HomeComponent,
    CreateConversationComponent,
    MyConversationsComponent,
    ConversationRoomComponent,
    AllUsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocialLoginModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    Ng2SearchPipeModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '888538511849-mtdpgnuc39fmh92eks2oltpeh2h0p202.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('361668808275030')
          }
        ]
      } as SocialAuthServiceConfig,
    },
    tchatInterceptor,
    WebsocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
