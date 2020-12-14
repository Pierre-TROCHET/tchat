import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService, SocialUser } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { TokenDto } from '../models/token-dto';
import { OauthService } from '../services/oauth.service';
import { TokenService } from '../services/token.service';
 
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  socialUser: SocialUser;
  userLogged: SocialUser;
  NAME_KEY: string = "name";
  PHOTOURL_KEY: string = "photoUrl";
  canLogin: boolean = true;
  
  constructor(
    private authService: SocialAuthService,
    private router: Router,
    private oauthService: OauthService,
    private tokenService: TokenService
  ) { }
 
  ngOnInit(): void {
    this.authService.authState.subscribe(
      data => {
        this.userLogged = data;
      }
    );
  }
 
  signInWithGoogle(): void {
    this.canLogin = false;
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      data => {
        this.socialUser = data;
        //sessionStorage.setItem(this.NAME_KEY, this.socialUser.name);
        //sessionStorage.setItem(this.PHOTOURL_KEY, this.socialUser.photoUrl);
        const tokenGoogle = new TokenDto(this.socialUser.idToken);
        this.oauthService.google(tokenGoogle).subscribe(
          res => {
            this.tokenService.setToken(res.value);
            this.tokenService.setUserId(res.userId);
            this.canLogin = true;
            this.router.navigate(['/myconversations']);
          },
          err => {
            console.log(err);
            this.logOut();
            this.canLogin = true;
            $("#error-modal").modal();
          }
        );
      }
    ).catch(
      err => {
        console.log(err);
        this.canLogin = true;
      }
    );
  }
 
  signInWithFB(): void {
    this.canLogin = false;
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(
      data => {
        this.socialUser = data;
        //sessionStorage.setItem(this.NAME_KEY, this.socialUser.name);
        //sessionStorage.setItem(this.PHOTOURL_KEY, this.socialUser.photoUrl);
        const tokenFace = new TokenDto(this.socialUser.authToken);
        this.oauthService.facebook(tokenFace).subscribe(
          res => {
            this.tokenService.setToken(res.value);
            this.tokenService.setUserId(res.userId);
            this.router.navigate(['/myconversations']);
            this.canLogin = true;
          },
          err => {
            console.log(err);
            this.logOut();
            $("#error-modal").modal();
            this.canLogin = true;
          }
        );
      }
    ).catch(
      err => {
        console.log(err);
        this.canLogin = true;
      }
    );
  }
 
  logOut(): void {
    this.authService.signOut().then(
      data => {
        this.tokenService.logOut();
      }
    );
  }

}
