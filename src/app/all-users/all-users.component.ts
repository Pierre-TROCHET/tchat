import { Component, OnInit } from '@angular/core';
import { UserDto } from '../models/user-dto';
import { TchatService } from '../services/tchat.service';

declare var $: any;

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit {

  allUsers: UserDto[];
  term: string;

  constructor(private tchatService: TchatService) { }

  ngOnInit(): void {
    this.tchatService.getAllUsers().subscribe(
      value => {
        this.allUsers  = value; 
      },
      err => {
        $("#error-modal").modal();
        console.log(err);
      });
  }

}
