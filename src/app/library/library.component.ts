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

  ngOnInit(): void {
    if (this.api.isLoggedIn()) {
      this.getVideos();
      this.setVideos();
    } else {
      this.route.navigate(['SignIn']);
    }
  }

  getVideos() {
    this.dataFromDB = this.api.readVideoData();
  }

  setVideos() {
    console.log('Library', this.dataFromDB);
    let videoMap = new Map();
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
        videoMap.set(this.dataFromDB[links[i]].title.toString(), this.dataFromDB[links[i]]);
      }
      console.log(videoMap);
    }
  }
}
