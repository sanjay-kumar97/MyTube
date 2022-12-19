import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit, OnDestroy {

  id!: string;
  videoData: any;
  timer: any;
  loader: boolean = true;
  constructor(private route: ActivatedRoute, private api: ApiService) { }

  ngOnInit(): void {
    this.id = "" + this.route.snapshot.paramMap.get('id');
    this.videoData = this.api.readSpecificVideoData(this.id);
    console.log(this.videoData);
    setTimeout(() => {
      if (this.api.isLoggedIn()) {
        setTimeout(() => this.checkView(), 1000);
      }
      this.loader = false;
      this.videoData.time = this.findTime(this.videoData.time);
      console.log(this.videoData);
    }, 2000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  checkView() {
    var player = document.getElementsByTagName('video')[0];
    var uid = '' + this.api.getUserDetails().UID;
    var userData: any = this.api.readUserData();
    var viewedArr: String[];
    setTimeout(() => {
      viewedArr = userData[uid].viewed;
      if (viewedArr[0] == "") {
        console.log('NULLLLLLL');
        viewedArr.shift();
      }
    }, 2000);
    this.timer = setInterval(() => {
      let current = Math.floor(player.currentTime);
      let total = Math.ceil(player.duration / 2);
      console.log({ total, current });
      if (current == total) {
        console.log('COUNTED AS A VIEW!');
        clearInterval(this.timer);
        this.videoData.views += 1;
        if (!viewedArr.includes(this.id)) {
          viewedArr.push(this.id);
          this.api.writeUserData(userData[uid].name, uid, userData[uid].profileImage, userData[uid].liked, viewedArr, userData[uid].uploaded, userData[uid].notifications, userData[uid].joined,);
        }
        this.api.writeVideoData(this.videoData.url, this.videoData.title, this.videoData.videoId, this.videoData.description, this.videoData.likes, this.videoData.views, this.videoData.userId, this.videoData.time);
      }
    }, 1000);
  }

  findTime(prevDate: any) {
    var currDate = new Date().getTime();
    var result;
    console.log({ prevDate, currDate });
    var diffInMs = getDifferenceInMs(prevDate, currDate);
    var seconds = Math.floor(diffInMs / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    var weeks = Math.floor(days / 7);
    var months = Math.floor(days / 30);
    var years = Math.floor(months / 12);
    console.log({ years, months, weeks, days, hours, minutes, seconds });
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
    console.log('Final', result);

    function getDifferenceInMs(date1: number, date2: number) {
      const diffInMs = Math.abs(date2 - date1);
      return diffInMs;
    }

    return result;
  }
}
