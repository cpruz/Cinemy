import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = '/cinemy/api/v1/users/';

  user : any;
  csrf!: string;

  constructor(private http : HttpClient) { 
    if(localStorage.getItem('user')){
      this.user = JSON.parse(localStorage.getItem('user')!);
    }
    if(localStorage.getItem('csrf')){
      this.csrf = JSON.parse(localStorage.getItem('csrf')!);
    }
  }

  login(username : any, password : any): Observable<any>{
    let credentials = {username: username, password: password};
    let newUrl = this.url + 'login';
    return this.http.post<any>(newUrl, credentials, { observe : 'response'});
  }

  register(firstname : any, lastname : any, username : any, password : any, confirmedPassword : any) : Observable<any>{
    let credentials = {firstname: firstname, lastname: lastname, username: username, password: password, confirmedPassword: confirmedPassword};
    let newUrl = this.url + 'register';
    return this.http.post<any>(newUrl, credentials, { observe : 'response'});
  }

  logout(): Observable<any>{
    let newUrl = this.url + 'logout';
    return this.http.post<any>(newUrl, {}, { observe : 'response'});
  }

  changePassword(oldPassword : any, newPassword : any, confNewPassword : any) : Observable<any>{
    let newUrl = this.url + this.getUser().id + "/update";
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json").set("X-CSRF-TOKEN", this.getToken());
    let credentials = {oldPassword: oldPassword, newPassword: newPassword, confNewPassword: confNewPassword};
    return this.http.put<any>(newUrl, credentials, {'headers': headers, observe : 'response'});
  }

  changeUserPassword(username : string, newPassword : any, confNewPassword : any): Observable<any>{
    let newUrl = this.url + "admin";
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json").set("X-CSRF-TOKEN", this.getToken());
    let credentials = {username: username, newPassword: newPassword, confNewPassword: confNewPassword};
    return this.http.put<any>(newUrl, credentials, {'headers': headers, observe : 'response'});
  }

  changeRole(username : string, action : string): Observable<any>{
    let newUrl = this.url + "role";
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json").set("X-CSRF-TOKEN", this.getToken());
    let credentials = {username: username, action : action};
    return this.http.put<any>(newUrl, credentials, {'headers': headers, observe : 'response'});
  }

  searchUsers(searchText : any): Observable<User[]> {
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json").set("X-CSRF-TOKEN", this.getToken());
    let newUrl = this.url + 'search/' + searchText;
    return this.http.get<User[]>(newUrl, {'headers': headers});
  }

  deleteUser(username : string): Observable<any>{
    let newUrl = this.url + username;
    return this.http.delete<any>(newUrl, { observe : 'response'});
  }

  getUsers(): Observable<any>{
    let newUrl = this.url + "/list";
    return this.http.get<any>(newUrl, { observe : 'response'});
  }

  setToken( csrf : string): void {
    this.csrf = csrf;
    localStorage.setItem('csrf', JSON.stringify(csrf));
  }

  setUser(user : any){
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser( ) : any {
    return this.user;
  }

  getToken( ) : string {
    return this.csrf;
  }
}
