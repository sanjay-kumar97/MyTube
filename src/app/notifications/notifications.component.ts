import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { HeaderComponent } from '../header/header.component';
import { ApiService } from '../services/api.service';

@Component({
  providers: [AppComponent, HeaderComponent, ApiService],
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  loader: boolean = true;
  userData: any;
  videoData: any;
  count!: number;
  uid: any;
  notifyArr: any;
  newNotifyArr: any;

  constructor(private router: Router, private api: ApiService, public app: AppComponent, private head: HeaderComponent) { }

  ngOnInit(): void {
    let wholeData = JSON.parse('' + sessionStorage.getItem('DATA'));
    console.log({ wholeData });
    setTimeout(() => {
      this.userData = this.api.readUserData();
      this.videoData = this.api.readVideoData();
      if (this.api.isLoggedIn()) {
        setTimeout(() => {
          this.uid = this.api.getUserDetails().UID;
          this.notifyArr = this.userData[this.uid].notifications;
          if (this.notifyArr[0] == "") {
            console.log('NULLLLLLL');
            this.notifyArr.shift();
          }
          this.count = this.notifyArr.length;
          console.log({ video: this.videoData, user: this.userData, notifi: this.notifyArr });
          setTimeout(() => this.loader = false, 2000);
        }, 2000);
      } else {
        sessionStorage.setItem('Prev', 'notifications');
        this.router.navigate(['SignIn']);
      }
    }, 2000);
  }

  getActionText(item: any) {
    if (item.action === "Posted") {
      return "Your Video was Uploaded Successfully!";
    } else if (item.action === "Liked") {
      return this.userData[item.userId].name + " has Liked Your Video.";
    } else if (item.action === "Removed") {
      return "Your Video was Removed!";
    } else {
      return "No Comments Simply Waste!";
    }
  }

  changeStatus(i: number, status: String) {
    console.log(this.notifyArr, { i, status });
    // let newNotifyArr = this.notifyArr;
    if (status === 'Visible') {
      this.notifyArr[i].status = 'Invisible';
    } else {
      this.notifyArr[i].status = 'Visible';
    }
    console.log(this.notifyArr);
    let user = this.userData[this.uid];
    this.api.writeUserData(user.name, this.uid, user.profileImage, user.liked, user.viewed, user.uploaded, this.notifyArr, user.joined);
    // setTimeout(() => this.head.ngOnInit(), 2000);
    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //   this.router.navigate(['/notifications']);
    // });
  }
}