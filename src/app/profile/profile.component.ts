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
  videoData: any;
  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.id = "" + this.route.snapshot.paramMap.get('id');
    if (!this.api.isLoggedIn()) {
      sessionStorage.setItem('Prev', 'profile');
      this.router.navigate(['SignIn']);
    }
  }

}
