import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Input() username : string | undefined;
  @Input() password : string | undefined;

  constructor(private router : Router, private userService : UserService) { }

  ngOnInit(): void {
    this.username = "";
    this.password = "";
  }

  login(){
    this.userService.login(this.username, this.password).subscribe(res => {
      let data = res.body;
        if(data == "Invalid password"){
          alert("Invalid password");
          this.username = '';
          this.password = '';
        }
        else if(data == "Invalid username"){
          alert("Invalid username");
          this.username = '';
          this.password = '';
        }
        else if(data == "Please enter valid login info"){
          alert("Please enter valid login info");
          this.username = '';
          this.password = '';
        }
        else{
          this.userService.setToken(res.headers.get('X-CSRF-TOKEN'));
          data.id = data._id;
          this.userService.setUser(data);
          this.router.navigateByUrl('home');
        }
    });
  }

}
