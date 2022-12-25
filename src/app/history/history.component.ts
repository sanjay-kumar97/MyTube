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
  currUserData: any;
  videoData: any;
  videoArr!: Array<any>;

  constructor(private router: Router, private api: ApiService) { }

  ngOnInit(): void {
    this.videoData = this.api.readVideoData();
    setTimeout(() => {
      if (this.api.isLoggedIn()) {
        let uid = this.api.getUserDetails().UID;
        console.log(uid);
        this.currUserData = this.api.readSpecificUserData('' + uid);
        let keys = Object.keys(this.videoData);
        setTimeout(() => {
          let viewed = this.currUserData.viewed;
          this.videoArr = new Array<any>;
          console.log('Initialized -> ', this.videoArr)
          console.log(this.videoData, keys);
          for (let i = 0; i < Object.keys(this.videoData).length; i++) {
            if ((viewed).includes(keys[i])) {
              this.videoArr.push(this.videoData[keys[i]]);
            }
          }
          console.log(this.videoArr);
        }, 1000);
      } else {
        sessionStorage.setItem('Prev', 'history');
        this.router.navigate(['SignIn']);
      }
      setTimeout(() => this.loader = false, 2000);
    }, 2000);
  }

}
