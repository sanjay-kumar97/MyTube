import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AppComponent } from '../app.component';

@Component({
  providers: [AppComponent],
  selector: 'app-test-layout',
  templateUrl: './test-layout.component.html',
  styleUrls: ['./test-layout.component.scss']
})
export class TestLayoutComponent implements OnInit {

  constructor(private api: ApiService, private app: AppComponent) { }
  currUserData: any;
  userData: any;
  notifyArr: any;
  videoData: any;
  count!: number;
  loader: boolean = true;
  ngOnInit(): void {
    this.count = 5;
    this.userData = this.api.readUserData();
    // setTimeout(() => this.currUserData = this.api.readSpecificUserData('' + this.api.getUserDetails().UID), 2000);
    this.videoData = this.api.readVideoData();
    setTimeout(() => { this.currUserData = this.api.readSpecificUserData('' + this.api.getUserDetails().UID); setTimeout(() => { this.notifyArr = this.currUserData.notifications; this.loader = false; }, 3200); console.log(this.currUserData) }, 1000);
  }

}
