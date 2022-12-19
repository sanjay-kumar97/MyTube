import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoryComponent } from './history/history.component';
import { HomeComponent } from './home/home.component';
import { LibraryComponent } from './library/library.component';
import { ProfileComponent } from './profile/profile.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { TestLayoutComponent } from './test-layout/test-layout.component';
import { UploadVideoComponent } from './upload-video/upload-video.component';
import { VideoComponent } from './video/video.component';

const routes: Routes = [
  { path: '', redirectTo: 'Home', pathMatch: 'full' },
  { path: 'Home', component: HomeComponent },
  { path: 'watch/:id', component: VideoComponent },
  { path: 'Upload', component: UploadVideoComponent },
  { path: 'SignIn', component: SignInComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'library', component: LibraryComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'Test', component: TestLayoutComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
