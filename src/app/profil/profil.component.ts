import { Component, OnInit } from '@angular/core';
import { UserDto } from '../models/user-dto';
import { TchatService } from '../services/tchat.service';

declare var $: any;

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

  userDto: UserDto = new UserDto;

  constructor(private tchatService: TchatService) { }

  ngOnInit(): void {
    this.tchatService.getMyInformations().subscribe(
      data => {
        this.userDto = data;
      },
      err => {
        console.log(err);
        $("#error-modal").modal();
      }
    );
  }

}
