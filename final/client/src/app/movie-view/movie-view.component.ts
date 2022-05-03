import { Component, OnInit, Input } from '@angular/core';
import { MovieService } from '../services/movie.service';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-movie-view',
  templateUrl: './movie-view.component.html',
  styleUrls: ['./movie-view.component.css']
})
export class MovieViewComponent implements OnInit {
  user : any;
  isCollapsed = true;
  movie : any = {};

  @Input() title : string | undefined;
  @Input() score : string | undefined;
  @Input() description : string | undefined;

  constructor(private movieService : MovieService, 
    private userService : UserService, private router : Router,
    private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.getMovie(this.route.snapshot.paramMap.get('mid'));
    this.user = this.userService.getUser();
  }

  getMovie(gid: any): void{
    this.movieService.getMovie(gid).subscribe(movie => {
      this.movie = movie;
    });
  }

  logout(): void{
    this.userService.logout().subscribe();
    this.userService.setUser(null);
    this.userService.setToken("");
    this.router.navigateByUrl('login');
  }

  post(): void{
    this.movieService.post(this.title, this.score, this.description, this.route.snapshot.paramMap.get('mid')).subscribe(res => {
      if(res.body == "Please fill out all fields to make a post."){
        alert("Please fill out all fields to make a post.");
      }
      else{
        this.title = "";
        this.score = "";
        this.description = "";
        this.movie = res.body;
      }
    });
  }

}
