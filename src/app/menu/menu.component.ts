import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  @Input('menuItem') menuItem: string;

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private authService: SocialAuthService
  ) { }

  ngOnInit(): void {

  }

  logOut(): void {
    this.authService.signOut().then(
      data => {
        this.tokenService.logOut();
      }
    );
    this.router.navigate(['/home']);
  }

}
