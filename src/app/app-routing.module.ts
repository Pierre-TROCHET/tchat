import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllUsersComponent } from './all-users/all-users.component';
import { CreateConversationComponent } from './create-conversation/create-conversation.component';
import { TchatGuard } from './guards/tchat.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MyConversationsComponent } from './my-conversations/my-conversations.component';
import { ProfilComponent } from './profil/profil.component';

const routes: Routes = [  {
  path: '',
  redirectTo: "/home",
  pathMatch: 'full'
},
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profil', component: ProfilComponent, canActivate: [ TchatGuard ]},
  { path: 'createconversation', component: CreateConversationComponent, canActivate: [ TchatGuard ]},
  { path: 'myconversations', component: MyConversationsComponent, canActivate: [ TchatGuard ]},
  { path: 'allusers', component: AllUsersComponent, canActivate: [ TchatGuard ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
