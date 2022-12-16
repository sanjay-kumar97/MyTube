import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  loader: boolean = true;

  constructor(private router: Router, private api: ApiService) { }

  ngOnInit(): void {
    setTimeout(() => {
      if (this.api.isLoggedIn()) {
        this.loader = false;
      } else {
        sessionStorage.setItem('Prev', 'history');
        this.router.navigate(['SignIn']);
      }
    }, 2000);
  }

}
