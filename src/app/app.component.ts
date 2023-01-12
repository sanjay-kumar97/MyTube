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

  public userDetails: any;
  public userData: any;
  public videoData: any;
  public currUserData: any;
  public isLoggedIn!: boolean;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.api.getAllData();
      this.isLoggedIn = this.api.isLoggedIn() ? true : false;
      this.userDetails = this.api.getUserDetails();
      this.userData = this.api.readUserData();
      this.videoData = this.api.readVideoData();
      this.currUserData = this.api.readSpecificUserData(this.userDetails.UID);
      console.log('From Root!', { 'logged': this.isLoggedIn, 'userDetails': this.userDetails, 'userData': this.userData, 'videoData': this.videoData });
    }, 500);
  }

  public findTime(prevDate: any) {
    var currDate = new Date().getTime();
    var result;
    // console.log({ prevDate, currDate });
    var diffInMs = getDifferenceInMs(prevDate, currDate);
    var seconds = Math.floor(diffInMs / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    var weeks = Math.floor(days / 7);
    var months = Math.floor(days / 30);
    var years = Math.floor(months / 12);
    // console.log({ years, months, weeks, days, hours, minutes, seconds });
    if (years != 0) {
      result = years + " ";
      result += (years == 1) ? "year" : "years";
    } else if (months != 0) {
      result = months + " ";
      result += (months == 1) ? "month" : "months";
    } else if (weeks != 0) {
      result = weeks + " ";
      result += (weeks == 1) ? "week" : "weeks";
    } else if (days != 0) {
      result = days + " ";
      result += (days == 1) ? "day" : "days";
    } else if (hours != 0) {
      result = hours + " ";
      result += (hours == 1) ? "hour" : "hours";
    } else if (minutes != 0) {
      result = minutes + " ";
      result += (minutes == 1) ? "minute" : "minutes";
    } else {
      result = seconds + " ";
      result += (seconds == 1) ? "second" : "seconds";
    }
    // console.log('Final', result);

    function getDifferenceInMs(date1: number, date2: number) {
      const diffInMs = Math.abs(date2 - date1);
      return diffInMs;
    }
    return result;
  }
}
