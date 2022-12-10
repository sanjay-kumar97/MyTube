import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {

  constructor(private api: ApiService, private sanitizer: DomSanitizer, private route: Router) { }

  dataFromDB: any;
  localMap: any;
  loader: boolean = true;
  userDetails!: any;

  ngOnInit(): void {
    if (this.api.isLoggedIn()) {
      this.getVideos();
      this.setVideos();
      this.userDetails = this.api.getUserDetails();
    } else {
      this.route.navigate(['SignIn']);
    }
  }

  getVideos() {
    this.dataFromDB = this.api.readVideoData();
  }

  setVideos() {
    // this.userId = this.api.auth.currentUser?.uid;
    console.log('Library', this.dataFromDB);
    setTimeout(() => {
      var videoMap = new Map();
      let links = Object.keys(this.dataFromDB);
      for (let i = 0; i < links.length; i++) {
        let link = this.dataFromDB[links[i]].url;
        this.dataFromDB[links[i]].url = this.sanitizer.bypassSecurityTrustResourceUrl(link);
        // console.log(this.dataFromDB[Object.keys(this.dataFromDB)[i]].title, Object.values(this.dataFromDB)[i]);

        // var date = new Date([Object.keys(this.dataFromDB)[i]]);
        // this.dataFromDB[Object.keys(this.dataFromDB)[i]].time = date.toLocaleString();
        // this.dataFromDB[Object.keys(this.dataFromDB)[i]].time = this.findTime(this.dataFromDB[Object.keys(this.dataFromDB)[i]].time);
        // videoMap.set(this.dataFromDB[Object.keys(this.dataFromDB)[i]].title.toString(), Object.values(this.dataFromDB)[i]);
        for (let i = 0; i < links.length; i++) {
          if (this.dataFromDB[links[i]].userId == this.userDetails.UID) {
            videoMap.set(this.dataFromDB[links[i]].title.toString(), this.dataFromDB[links[i]]);
          }
        }
        console.log(videoMap);
      }
      setTimeout(() => { this.localMap = videoMap; this.loader = false; console.log(this.localMap) }, 2000);
    }, 2000)
  }

  getValues(map: any[]) {
    return Array.from(map.values());
  }

  deleteVideo(videoTitle: String, videoId: String) {
    this.api.removeFromStorage(videoTitle, videoId);
    setTimeout(() => window.location.reload(), 2000);
  }
}
