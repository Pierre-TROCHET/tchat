import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDto } from '../models/user-dto';
import { TchatService } from '../services/tchat.service';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ConversationDto } from '../models/conversation-dto';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-create-conversation',
  templateUrl: './create-conversation.component.html',
  styleUrls: ['./create-conversation.component.css']
})
export class CreateConversationComponent implements OnInit {

  form: FormGroup;
  usersData: UserDto[];
  usersLoaded: boolean = false;
  submitUsersOk: boolean = false;
  submitNameOk: boolean = false;

  constructor(private tchatService: TchatService,
    private router: Router,
    private fb: FormBuilder) {   
      this.form = this.fb.group({
        name: '',
        users: this.fb.array([])
    })
    }

  ngOnInit(): void {
    this.waitUsersData();
  }

waitUsersData(){
  return this.tchatService.getAllUsersButNotMe().subscribe(
    value => {
      this.usersLoaded = true; 
      this.usersData  = value; 
    },
    err => {
      $("#error-modal").modal();
      console.log(err);
    });
}

  onCheckboxChange(e) {
    const checkArray: FormArray = this.form.get('users') as FormArray;
    if (e.target.checked) {
      let usertoAdd:UserDto = new UserDto;
      usertoAdd.id =  e.target.value;
      checkArray.push(new FormControl(usertoAdd));
      this.submitUsersOk = true;
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value.id == e.target.value) {
          checkArray.removeAt(i);
          if(checkArray.length == 0){
            this.submitUsersOk = false;
          }
          return;
        }
        i++;
      });
    }
  }

  onNameChange(e){
    if(e.target.value == ""){
      this.submitNameOk = false;
    }else{
      this.submitNameOk = true;
    }
  }

  submitForm() {
    let conversationDto:ConversationDto = new ConversationDto;
    conversationDto.name = this.form.value.name;
    conversationDto.users = this.form.value.users;
    this.tchatService.addConversation(conversationDto).subscribe(
      (result: ConversationDto) => {
        //TODO: Commenter ligne ci-dessous
        console.log(result);
        //Rediriger vers la conversation nouvelle
        sessionStorage.setItem("currentConversationId", result.id+"");
        this.router.navigate(['/myconversations', {creation:1}]);
      },
      error => {
        $("#error-modal").modal();
        console.log(error);
      }

    );

  }
}
