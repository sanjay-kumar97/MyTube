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
  constructor(private route: ActivatedRoute, private api: ApiService) { }

  ngOnInit(): void {
    this.id = "" + this.route.snapshot.paramMap.get('id');
    this.videoData = this.api.readSpecificVideoData(this.id);
    console.log(this.videoData);
    setTimeout(() => {
      if (this.api.isLoggedIn()) {
        this.checkView();
      }
    }, 1000);
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
      let total = Math.floor(player.duration / 2);
      console.log({ total, current });
      if (current == total) {
        console.log('COUNTED AS A VIEW!');
        clearInterval(this.timer);
        this.videoData.views += 1;
        viewedArr.push(this.id);
        this.api.writeUserData(userData[uid].name, uid, userData[uid].liked, viewedArr, userData[uid].uploaded, userData[uid].joined,);
        this.api.writeVideoData(this.videoData.url, this.videoData.title, this.videoData.videoId, this.videoData.description, this.videoData.likes, this.videoData.views, this.videoData.userId, this.videoData.time);
      }
    }, 1000);
  }
}
