import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'MyTube';
  sideNavState: boolean = true;
  userDetails: any;
  loggedIn!: boolean;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.loggedIn = this.api.isLoggedIn() ? true : false;
    this.userDetails = this.api.getUserDetails();
    console.log('From Root!', this.loggedIn, this.userDetails);
  }
}
