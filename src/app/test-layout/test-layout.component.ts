import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-test-layout',
  templateUrl: './test-layout.component.html',
  styleUrls: ['./test-layout.component.scss']
})
export class TestLayoutComponent implements OnInit {

  constructor(private api: ApiService) { }
  currUserData: any;
  userData: any;
  notifyArr: any;
  videoData: any;
  loader: boolean = true;
  ngOnInit(): void {
    this.userData = this.api.readUserData();
    // setTimeout(() => this.currUserData = this.api.readSpecificUserData('' + this.api.getUserDetails().UID), 2000);
    this.videoData = this.api.readVideoData();
    setTimeout(() => { this.currUserData = this.api.readSpecificUserData('' + this.api.getUserDetails().UID); setTimeout(() => { this.notifyArr = this.currUserData.notifications; this.loader = false; }, 3200); console.log(this.currUserData) }, 1000);
  }

}
