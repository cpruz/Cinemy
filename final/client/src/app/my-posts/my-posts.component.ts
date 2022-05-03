import { Component, OnInit, Input } from '@angular/core';
import { MovieService } from '../services/movie.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Post } from '../models/post';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.css']
})
export class MyPostsComponent implements OnInit {
  user : any;
  result = '';
  isCollapsed = true;
  posts : Post[] = [];
  selectedPost : any = {};

  @Input() title : string | undefined;
  @Input() score : string | Number |undefined;
  @Input() description : string | undefined;

  constructor(private movieService : MovieService, 
    private userService : UserService, private router : Router, 
    private modalService: NgbModal, private postService : PostService) { }

  ngOnInit(): void {
    this.getPosts();
    this.user = this.userService.getUser();
  }

  getPosts(): void{
    this.postService.getPosts().subscribe(posts => {
      this.posts = posts;
    });
  }

  open(content: any): void {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
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
    });
  }

  deletePost(): void{
    this.movieService.delete(this.selectedPost._id).subscribe(res => {
      this.result = res.body;
    });
  }

  dismiss(): void{
    this.result = '';
    this.modalService.dismissAll();
    this.getPosts();
  }

  logout(): void{
    this.userService.logout().subscribe();
    this.userService.setUser(null);
    this.userService.setToken("");
    this.router.navigateByUrl('login');
  }

}
