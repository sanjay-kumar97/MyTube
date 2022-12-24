import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  loader: boolean = true;

  constructor(private router: Router, private api: ApiService) { }

  ngOnInit(): void {
    setTimeout(() => {
      if (this.api.isLoggedIn()) {
        this.loader = false;
      } else {
        sessionStorage.setItem('Prev', 'notifications');
        this.router.navigate(['SignIn']);
      }
    }, 2000);
  }

}
