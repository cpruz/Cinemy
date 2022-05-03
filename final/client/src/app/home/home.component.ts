import { Component, OnInit, Input } from '@angular/core';
import { MovieService } from '../services/movie.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user : any;
  isCollapsed = true;
  popButton = true;
  nowButton = false;
  topButton = false;
  movies : any[] = [];

  @Input() searchText : string | undefined;
  // Clean up code
  // Add to eucalyptus
  // Add readme and post to github

  constructor(private movieService : MovieService, 
    private userService : UserService, private router : Router) { }

  ngOnInit(): void {
    this.getMovies('popular');
    this.user = this.userService.getUser();
  }

  getMovies(category : string): void{
    if(category == 'popular'){
      this.popButton = true;
      this.nowButton = false;
      this.topButton = false;
    }
    else if(category == 'now_playing'){
      this.popButton = false;
      this.nowButton = true;
      this.topButton = false;
    }
    else if(category == 'top_rated'){
      this.popButton = false;
      this.nowButton = false;
      this.topButton = true;
    }
    this.movieService.getMovies(category).subscribe(res => {
      this.movies = res;
    });
  }

  searchMovie(): void{
    this.movieService.searchMovie(this.searchText).subscribe(res => {
      this.movies = res;
      this.popButton = false;
      this.nowButton = false;
      this.topButton = false;
      this.searchText = '';
    });
  }

  logout(): void{
    this.userService.logout().subscribe();
    this.userService.setUser(null);
    this.userService.setToken("");
    this.router.navigateByUrl('login');
  }

  openMovie(mid: string): void{
    this.router.navigate(['/movie', mid]);
  }

}
