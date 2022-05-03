import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Movie } from '../models/movie';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  url = '/cinemy/api/v1/movies/';

  constructor(private http : HttpClient, private userService : UserService) { }

  getMovies(category : string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json").set("X-CSRF-TOKEN", this.userService.getToken());
    let newUrl = this.url + 'category/' + category;
    return this.http.get<any>(newUrl, {'headers': headers});
  }

  searchMovie(searchText : any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json").set("X-CSRF-TOKEN", this.userService.getToken());
    let newUrl = this.url + 'search/' + searchText;
    return this.http.get<any>(newUrl, {'headers': headers});
  }

  getMovie(mid : any): Observable<Movie>{
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json").set("X-CSRF-TOKEN", this.userService.getToken());
    let newUrl = this.url + mid;
    return this.http.get<Movie>(newUrl, {'headers': headers});
  }

  post(title : any, score : any, description : any, mid : any): Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json").set("X-CSRF-TOKEN", this.userService.getToken());
    let uid = this.userService.getUser().id;
    let newUrl = this.url + mid + '/post/' + uid;
    let credentials = {title: title, score: score, description: description};
    return this.http.post<any>(newUrl, credentials, {'headers': headers, observe : 'response'});
  }

  update(title : any, score : any, description : any, pid : any): Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json").set("X-CSRF-TOKEN", this.userService.getToken());
    let newUrl = 'cinemy/api/v1/posts/' + pid;
    let credentials = {title: title, score: score, description: description};
    return this.http.put<any>(newUrl, credentials, {'headers': headers, observe : 'response'});
  }

  delete(pid : any): Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json").set("X-CSRF-TOKEN", this.userService.getToken());
    let newUrl = 'cinemy/api/v1/posts/' + pid;
    return this.http.delete<any>(newUrl, {'headers': headers, observe : 'response'});
  }

}
