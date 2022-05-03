import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user : any;
  isCollapsed = true;

  @Input() oldPassword : string | undefined;
  @Input() newPassword : string | undefined;
  @Input() confNewPassword : string | undefined;

  constructor(private userService : UserService, private router : Router) { }

  ngOnInit(): void {
    this.oldPassword = "";
    this.newPassword = "";
    this.confNewPassword = "";
    this.user = this.userService.getUser();
  }

  logout(): void{
    this.userService.logout().subscribe();
    this.userService.setUser(null);
    this.userService.setToken("");
    this.router.navigateByUrl('login');
  }

  changePassword(): void{
    this.userService.changePassword(this.oldPassword, this.newPassword, this.confNewPassword).subscribe(res => {
      alert(res.body);
      this.oldPassword = "";
      this.newPassword = "";
      this.confNewPassword = "";
    });
  }

}
