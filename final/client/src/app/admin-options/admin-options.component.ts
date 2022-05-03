import { Component, OnInit, Input } from '@angular/core';
import { MovieService } from '../services/movie.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Post } from '../models/post';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-admin-options',
  templateUrl: './admin-options.component.html',
  styleUrls: ['./admin-options.component.css']
})
export class AdminOptionsComponent implements OnInit {
  user : any;
  users : any[] = [];
  page2 = 1;
  pageSize = 4;
  collectionSize : number = 0;
  active : any = "";
  isCollapsed = true;
  result = '';
  posts : Post[] = [];
  selectedPost : any = {};
  popButton = false;
  nowButton = false;
  topButton = false;
  page: number = 1;
  count: number = 0;
  tableSize: number = 9;

  @Input() newPassword : string | undefined;
  @Input() confNewPassword : string | undefined;
  @Input() firstname : string | undefined;
  @Input() lastname : string | undefined;
  @Input() username : string | undefined;
  @Input() password : string | undefined;
  @Input() confirmedPassword : string | undefined;
  @Input() searchText : string | undefined;
  @Input() userSearchText : string | undefined;
  @Input() title : string | undefined;
  @Input() score : string | Number |undefined;
  @Input() description : string | undefined;
  

  constructor(private movieService : MovieService, 
    public userService : UserService, private router : Router,
    private modalService: NgbModal, private postService : PostService) {
    }

    ngOnInit(): void {
      this.newPassword = "";
      this.confNewPassword = "";
      this.user = this.userService.getUser();
      this.getUsers();
      this.getAllPosts();
    }

    searchUsers(): void{
      this.userService.searchUsers(this.userSearchText).subscribe(res => {
        this.users = res;
        this.userSearchText = '';
        this.collectionSize = this.users.length;
      });
    }

    refreshUsers() {
      this.users
        .map((user, i) => ({id: i + 1, ...user}))
        .slice((this.page2 - 1) * this.pageSize, (this.page2 - 1) * this.pageSize + this.pageSize);
    }

    makeActive(user : any): void{
      this.active = user;
    }

    getUsers(): void{
      this.userService.getUsers().subscribe(res => {
        this.users = res.body;
        this.collectionSize = this.users.length;
        this.active = "";
      });
    }

    getAllPosts(): void{
      this.postService.getAllPosts().subscribe(posts => {
        this.posts = posts;
      });
    }

    searchPosts(): void{
      this.postService.searchPosts(this.searchText).subscribe(res => {
        this.posts = res;
        this.searchText = '';
      });
    }

    onTableDataChange(event: any) {
      this.page = event;
    }
    onTableDataChange2(event: any) {
      this.page2 = event;
    }

    changeRole(event : any, action : string): void{
      event.preventDefault();
      if(this.active != ""){
        this.userService.changeRole(this.active.username, action).subscribe(res => {
          alert(res.body);
        });
        this.getUsers();
      }
      else{
        alert("Select a user");
      }
    }

    open(content: any): void {
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    }
  
    openFunc(event : any, content: any): void{
      event.preventDefault();
      if(this.active != ""){
        this.open(content);
      }
      else{
        alert("Select a user");
      }
    }

    openEdit(content: any, post: Post): void{
      this.title = post.title;
      this.score = post.score;
      this.description = post.description;
      this.selectedPost = post;
      this.open(content);
    }
  
    openDelete(content: any, post: Post): void{
      this.selectedPost = post;
      this.open(content);
    }
    
    update(): void{
      this.movieService.update(this.title, this.score, this.description, this.selectedPost._id).subscribe(res => {
        this.title = "";
        this.score = "";
        this.description = "";
        this.result = res.body;
        this.getAllPosts();
      });
    }
  
    deletePost(): void{
      this.movieService.delete(this.selectedPost._id).subscribe(res => {
        this.result = res.body;
        this.getAllPosts();
      });
    }

    deleteUser(): void{
      this.userService.deleteUser(this.active.username).subscribe(res => {
        this.result = res.body;
        this.active = "";
        this.getUsers();
      });
    }

    dismiss(): void{
      this.result = '';
      this.modalService.dismissAll();
      this.user = this.userService.getUser();
      this.getUsers();
    }
  
    logout(): void{
      this.userService.logout().subscribe();
      this.userService.setUser(null);
      this.userService.setToken("");
      this.router.navigateByUrl('login');
    }

    register(){
      this.userService.register(this.firstname, this.lastname, this.username, this.password, this.confirmedPassword).subscribe(res => {
        alert(res.body);
        this.firstname = '';
        this.lastname = '';
        this.username = '';
        this.password = '';
        this.confirmedPassword = '';
        this.getUsers();
      });
    }
  
    changePassword(): void{
      this.userService.changeUserPassword(this.active.username, this.newPassword, this.confNewPassword).subscribe(res => {
        this.result = res.body;
        this.newPassword = "";
        this.confNewPassword = "";
      });
    }

}
