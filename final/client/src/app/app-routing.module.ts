import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { MovieViewComponent } from './movie-view/movie-view.component';
import { MyPostsComponent } from './my-posts/my-posts.component';
import { AdminOptionsComponent } from './admin-options/admin-options.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  {path: '', redirectTo:'login', pathMatch:'full'},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'movie/:mid', component: MovieViewComponent},
  {path: 'myposts', component: MyPostsComponent},
  {path: 'adminops', component: AdminOptionsComponent},
  {path: 'about', component: AboutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
