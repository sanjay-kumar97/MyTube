import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  id!: string;
  user: any;
  videoData: any;
  loader: boolean = true;
  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.id = "" + this.route.snapshot.paramMap.get('id');
    setTimeout(() => {
      if (!this.api.isLoggedIn()) {
        sessionStorage.setItem('Prev', 'profile');
        this.router.navigate(['SignIn']);
      } else {
        this.user = this.api.readSpecificUserData(this.id);
        setTimeout(() => this.loader = false, 1000);
      }
    }, 2000);
  }

  getDate(date: number) {
    return new Date(date).toDateString();
  }

}
