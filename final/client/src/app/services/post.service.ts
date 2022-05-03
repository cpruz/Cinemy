import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Post } from '../models/post';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  url = 'cinemy/api/v1/posts/'

  constructor(private http : HttpClient, private userService : UserService) { }

  getPosts(): Observable<Post[]>{
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json").set("X-CSRF-TOKEN", this.userService.getToken());
    let uid = this.userService.getUser().id;
    let newUrl = this.url + uid;
    return this.http.get<Post[]>(newUrl, {'headers': headers});
  }

  getAllPosts(): Observable<Post[]>{
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json").set("X-CSRF-TOKEN", this.userService.getToken());
    return this.http.get<Post[]>(this.url, {'headers': headers});
  }

  searchPosts(searchText : any): Observable<Post[]> {
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json").set("X-CSRF-TOKEN", this.userService.getToken());
    let newUrl = this.url + 'search/' + searchText;
    return this.http.get<Post[]>(newUrl, {'headers': headers});
  }
}
