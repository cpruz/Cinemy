import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Input() firstname : string | undefined;
  @Input() lastname : string | undefined;
  @Input() username : string | undefined;
  @Input() password : string | undefined;
  @Input() confirmedPassword : string | undefined;

  constructor(private router : Router, private userService : UserService) { }

  ngOnInit(): void {
    this.firstname = "";
    this.lastname = "";
    this.username = "";
    this.password = "";
    this.confirmedPassword = "";
  }

  register(){
    this.userService.register(this.firstname, this.lastname, this.username, this.password, this.confirmedPassword).subscribe(res => {
      let data = res.body;
        if(data == "Password does not have enough characters"){
          alert("Password does not have enough characters");
          this.password = "";
          this.confirmedPassword = "";
        }
        else if(data == "Passwords do not match"){
          alert("Passwords do not match");
          this.password = "";
          this.confirmedPassword = "";
        }
        else if(data == "Please provide info for all fields"){
          alert("Please provide info for all fields");
          this.firstname = "";
          this.lastname = "";
          this.username = "";
          this.password = "";
          this.confirmedPassword = "";
        }
        else if(data == "That username is already taken"){
          alert("That username is already taken");
          this.username = "";
          this.password = "";
          this.confirmedPassword = "";
        }
        else{
          alert("Account has been created!");
          this.router.navigateByUrl('login');
        }
    });
  }

}
