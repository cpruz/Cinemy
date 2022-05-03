import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  isCollapsed = true;
  user : any;

  constructor(private userService : UserService, private router : Router) { }

  ngOnInit(): void {
    this.user = this.userService.getUser();
  }

  logout(): void{
    this.userService.logout().subscribe();
    this.userService.setUser(null);
    this.userService.setToken("");
    this.router.navigateByUrl('login');
  }

}
