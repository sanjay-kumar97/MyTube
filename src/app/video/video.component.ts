import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  originalTime: any;
  isLoggedIn: boolean = false;
  currUserData: any;
  currUserId: any;
  userData: any;
  likedArr!: Array<String>;
  shareBtn = 'Share';

  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.id = "" + this.route.snapshot.paramMap.get('id');
    this.videoData = this.api.readSpecificVideoData(this.id);
    setTimeout(() => {
      this.userData = this.api.readSpecificUserData(this.videoData.userId);
      console.log(this.videoData);
      console.log('Ownerruuu', this.userData);
    }, 2000);
    setTimeout(() => {
      if (this.api.isLoggedIn()) {
        this.isLoggedIn = true;
        this.currUserId = this.api.getUserDetails().UID;
        this.currUserData = this.api.readSpecificUserData(this.currUserId);
        setTimeout(() => {
          this.checkView();
          console.log('LikedddArrrr', this.currUserData.liked);
          this.likedArr = this.currUserData.liked;
        }, 2000);
      }
      this.originalTime = this.videoData.time;
      this.videoData.time = this.findTime(this.videoData.time);
      console.log(this.videoData);
      setTimeout(() => this.loader = false, 1000);
    }, 2000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  getLike(e: any) {
    if (e.target.checked) {
      if (!this.isLoggedIn) {
        let prev = this.router.url;
        sessionStorage.setItem('Prev', prev);
        this.router.navigate(['SignIn']);
        this.videoData.likes += 1;
        this.likedArr.push(this.id);
      } else {
        this.videoData.likes += 1;
        this.likedArr.push(this.id);
        console.log('Liked', this.currUserData, this.likedArr);
      }
    } else {
      this.videoData.likes -= 1;
      // likedArr.pop();
      this.likedArr.splice(this.likedArr.indexOf(this.id), 1);
      console.log('Disliked', this.currUserData, this.likedArr);
    }

    this.api.writeVideoData(this.videoData.url, this.videoData.title, this.videoData.videoId, this.videoData.description, this.videoData.likes, this.videoData.views, this.videoData.userId, this.originalTime);

    if (this.likedArr.length == 0) { this.likedArr.push(''); }
    this.api.writeUserData(this.currUserData.name, this.currUserData.userId, this.currUserData.profileImage, this.likedArr, this.currUserData.viewed, this.currUserData.uploaded, this.currUserData.notifications, this.currUserData.joined);
  }

  checkView() {
    var player = document.getElementsByTagName('video')[0];
    var viewedArr: Array<String>;
    setTimeout(() => {
      viewedArr = this.currUserData.viewed;
      console.log(this.currUserId, this.currUserData.viewed);
      if (viewedArr[0] == "") {
        console.log('NULLLLLLL');
        viewedArr.shift();
      } else {
        console.log(viewedArr);
      }
    }, 100);
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
          this.api.writeUserData(this.currUserData.name, this.currUserId, this.currUserData.profileImage, this.currUserData.liked, viewedArr, this.currUserData.uploaded, this.currUserData.notifications, this.currUserData.joined,);
        }
        this.api.writeVideoData(this.videoData.url, this.videoData.title, this.videoData.videoId, this.videoData.description, this.videoData.likes, this.videoData.views, this.videoData.userId, this.originalTime);
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

  copyLinkToClipboard() {
    navigator.clipboard.writeText(location.href);
    this.shareBtn = 'Copied';
  }
}