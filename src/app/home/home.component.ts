import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as st from '@angular/fire/storage';
import * as db from '@angular/fire/database';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @Output() toggleSidebarForMe: EventEmitter<boolean> = new EventEmitter();

  name = 'Angular';
  constructor(private api: ApiService, private sanitizer: DomSanitizer, private router: Router) {
    // this.api.getValue().then((data: string) => {
    //   this.name = data;
    //   console.log(data);
    // })

  }

  links: any;
  users: any;
  videoId = '';
  file: any;
  dataFromDB: any;
  OriginalDataFromDB: any;
  loader: boolean = true;
  // showTitle: boolean = false;
  myUrl!: SafeResourceUrl;
  // arrayToIterrate: Array<any> = [];
  videoLinks: Array<SafeResourceUrl> = [];
  videoMap: any;
  urlMap: any;
  sideNaveState!: boolean;
  isLoggedIn!: boolean;
  isOnline: boolean = true;
  userFromDB: any;
  likedVids!: String[];
  currUser: any;

  ngOnInit(): void {
    if (!navigator.onLine) {
      this.isOnline = false;
    }
    else {
      // console.log('Home yayy', this.api.isLoggedIn() ? 'true' : 'false');
      // this.findTime(new Date('10 / 01 / 2020').getTime());
      // this.findTime(1670590490091);
      // setTimeout(() => {
      // this.setLinks();
      this.getLinks();
      // }
      //   , 2000);
      // setTimeout(() => {
      //   this.dataFromDB = this.api.readVideoData();
      //   setTimeout(() =>
      //     console.log('Should come', this.dataFromDB)
      //     , 5000);
      // }, 5000);
      // this.hellllYeahh();
      this.dataFromDB = this.api.readVideoData();
      this.OriginalDataFromDB = this.api.readVideoData();
      this.userFromDB = this.api.readUserData();
      setTimeout(() => {
        if (this.api.isLoggedIn()) {
          let uid = this.api.getUserDetails().UID;
          this.likedVids = this.userFromDB['' + uid].liked;
          console.log('HELLLOOOOOO', this.likedVids);
          this.currUser = this.userFromDB['' + uid];
        }
      }, 2000);
      setTimeout(() => { console.log(this.dataFromDB, this.userFromDB); }, 2000);
      setTimeout(() => {
        this.file = this.api.auth.currentUser?.displayName;
        console.log('UD', this.file);
        this.isLoggedIn = this.api.isLoggedIn();
      }, 1000);
      // sessionStorage.setItem('UID', String(null));
      // setInterval(() => {
      //   this.sideNaveState = (sessionStorage.getItem('sideNav') == 'true') ? false : true;
      //   console.log(this.sideNaveState);
      // }, 2000);

      // let link = "https://firebasestorage.googleapis.com/v0/b/mytube-v0.appspot.com/o/Okay%20Meme%20Template.mp4?alt=media&token=876b81a9-9710-46d1-8047-96d3e2c4f831";
      // this.myUrl = this.sanitizer.bypassSecurityTrustResourceUrl(link);
      // this.videoLinks.push(this.myUrl);
      // setTimeout(() => { this.isLoggedIn = (sessionStorage.getItem('UID') != "null") ? true : false; console.log(sessionStorage.getItem('UID'), this.isLoggedIn); }, 4000);
      // this.writeUserData('Peter', 'abx89v0908bns');
    }
  }

  setLinks() {
    console.log('From SetLinks');
    setTimeout(() => {
      console.log('From setLinks', this.dataFromDB);
      let urlMap = new Map();
      let N = Object.keys(this.dataFromDB).length;
      for (let i = 0; i < N; i++) {
        let id = this.dataFromDB[Object.keys(this.dataFromDB)[i]].videoId;
        let link = this.dataFromDB[Object.keys(this.dataFromDB)[i]].url;
        urlMap.set(id, link);
        // if (i == N - 1) {
        //   this.lastChild = id;
        //   console.log('YESSSSSS IMM HEREEEE!')
        // }

        // this.myUrl = this.sanitizer.bypassSecurityTrustResourceUrl(link);
        // console.log(this.myUrl);
        // this.videoLinks.push(link);
        // console.log(this.dataFromDB);
        // setTimeout(() => this.videoLinks.push(this.myUrl), 2000);
      }
      this.urlMap = urlMap;
      // this.videoLinks = this.videoLinks.sort(() => Math.random() - 0.5);
      console.log(this.urlMap);
      this.loader = false;
      // setTimeout(() => this.showTitle = true, 1000);
    }, 5000);
    // for (let i = 0; i < this.videoLinks.length; i++) {
    //   this.videoLinks[i].replace('u.be', 'ube.com/embed');
    //   this.dbService.writeData(this.videoLinks[i], i);
    // }
    // this.links = this.videoLinks.sort(() => Math.random() - 0.5);
    console.log('END of SetLinks');
  }

  // writeUserData(name: string, userId: string) {
  //   db.set(db.ref(this.database, 'users/' + userId), {
  //     name: name,
  //     userId: userId,
  //     viewed: [''],
  //     liked: [''],
  //     uploaded: [''],
  //     joined: new Date().toDateString()
  //   });
  //   // this.videoId += 1;
  // }

  getLinks() {
    // const starCountRef = db.ref(this.database, 'videos/');
    // db.onValue(starCountRef, (snapshot) => {
    //   this.dataFromDB = snapshot.val();
    //   console.log('From getLinks', this.dataFromDB);
    // });
    // this.data = this.dbService.readData();
    // this.dataFromDB = this.api.readVideoData();
    setTimeout(() => {
      this.links = Object.keys(this.dataFromDB);
      // this.users = Object.keys(this.userFromDB);
      this.links = this.links.sort(() => Math.random() - 0.5);
      console.log('From nowhere', this.links, this.dataFromDB[this.links[0]]);
      let videoMap = new Map();
      for (let i = 0; i < Object.keys(this.dataFromDB).length; i++) {
        let link = this.dataFromDB[Object.keys(this.dataFromDB)[i]].url;
        this.myUrl = this.sanitizer.bypassSecurityTrustResourceUrl(link);
        this.dataFromDB[Object.keys(this.dataFromDB)[i]].url = this.myUrl;
        console.log(this.dataFromDB[Object.keys(this.dataFromDB)[i]].title, Object.values(this.dataFromDB)[i]);

        // var date = new Date([Object.keys(this.dataFromDB)[i]]);
        // this.dataFromDB[Object.keys(this.dataFromDB)[i]].time = date.toLocaleString();
        this.dataFromDB[Object.keys(this.dataFromDB)[i]].time = this.findTime(this.dataFromDB[Object.keys(this.dataFromDB)[i]].time);
        // if(this.dataFromDB[this.links[i]].userId == this.userFromDB[this.users[i]].userId) {
        //   this.dataFromDB[]
        // }
        // console.log('Users', this.users, this.userFromDB);
        // videoMap.set(this.dataFromDB[Object.keys(this.dataFromDB)[i]].title.toString(), Object.values(this.dataFromDB)[i]);
        for (let i = 0; i < this.links.length; i++) {
          videoMap.set(this.dataFromDB[Object.keys(this.dataFromDB)[i]].title.toString(), this.dataFromDB[this.links[i]]);
        }
      }
      this.videoMap = videoMap;
      setTimeout(() => { console.log(this.videoMap) }, 2000);
      this.loader = false;
    }, 5000);
    // setTimeout(() => { for (let i = 0; i < 3; i++) { console.log('From Local', this.dataFromDB[Object.keys(this.dataFromDB)[i]].url); } }, 2000);
  }

  findTime(prevDate: any) {
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
    console.log('Final', result);
    // if (days > 7) {
    //   console.log('Weeks', Math.floor(days / 7));
    // }

    function getDifferenceInMs(date1: number, date2: number) {
      const diffInMs = Math.abs(date2 - date1);
      return diffInMs;
    }

    // function getDifferenceInDays(date1: number, date2: number) {
    //   const diffInMs = Math.abs(date2 - date1);
    //   return diffInMs / (1000 * 60 * 60 * 24);
    // }

    // function getDifferenceInHours(date1: number, date2: number) {
    //   const diffInMs = Math.abs(date2 - date1);
    //   return Math.floor(diffInMs / (1000 * 60 * 60));
    // }

    // function getDifferenceInMinutes(date1: number, date2: number) {
    //   const diffInMs = Math.abs(date2 - date1);
    //   return Math.floor(diffInMs / (1000 * 60));
    // }

    // function getDifferenceInSeconds(date1: number, date2: number) {
    //   const diffInMs = Math.abs(date2 - date1);
    //   return Math.floor(diffInMs / 1000);
    // }
    return result;
  }

  toggleSidebar() {
    this.toggleSidebarForMe.emit();
  }

  getValues(map: any[]) {
    return Array.from(map.values());
    // return Array.from(map.values()).sort(() => Math.random() - 0.5);
  }

  toggleVideo(e: any) {
    console.log('Clicked');
  }
  getLike(vidID: any, e: any) {
    // var player = document.getElementsByTagName('iframe')[0].contentWindow;
    // console.log(player?.focus());
    // function checkIfPlaying() {
    //   var playerStatus = player.getPlayerState();

    //   return playerStatus == 1;
    // } 
    // }
    // var iframe = document.querySelector('iframe'), video;
    // if (iframe) {
    //   video = iframe.contentWindow?.document.getElementsByTagName('video');
    // }
    // const x = document.getElementsByTagName('iframe')[0].contentWindow.getElementsByTagName('video');
    // console.log(video);

    // var data: any = this.api.readUserData();
    var uid = '' + this.api.getUserDetails().UID;
    var likedArr = this.userFromDB[uid].liked;
    var currUser: any = this.api.readSpecificUserData(vidID.userId);
    var notifyArr: Object[];
    setTimeout(() => {
      notifyArr = currUser.notifications;
      if (notifyArr[0] == "") {
        console.log('NULLLLLLL');
        notifyArr.shift();
      }
      console.log({ currUser, notifyArr });
    }, 1000);
    if (likedArr[0] == "") {
      console.log('NULLLLLLL');
      likedArr.shift();
    }
    console.log(e.target.checked, this.dataFromDB, likedArr);
    if (e.target.checked) {
      if (!this.isLoggedIn) {
        sessionStorage.setItem('Prev', 'Home');
        this.router.navigate(['SignIn']);
        this.dataFromDB[vidID.videoId].likes += 1;
        this.userFromDB[uid].liked.push(vidID.videoId);
      } else {
        this.dataFromDB[vidID.videoId].likes += 1;
        likedArr.push(vidID.videoId);
        console.log('Liked', this.userFromDB, likedArr);
        setTimeout(() => {
          notifyArr.unshift({ action: 'Liked', status: 'Visible', time: new Date().getTime(), userId: uid, videoId: vidID.videoId, title: vidID.title });
          this.api.writeUserData(currUser.name, currUser.userId, currUser.profileImage, currUser.liked, currUser.viewed, currUser.uploaded, notifyArr, currUser.joined);
        }, 2000);
      }
    } else {
      this.dataFromDB[vidID.videoId].likes -= 1;
      // likedArr.pop();
      likedArr.splice(likedArr.indexOf(vidID.videoId), 1);
      console.log('Disliked', this.userFromDB, likedArr);
    }
    var vid = this.OriginalDataFromDB[vidID.videoId];
    // console.log(vid.url, vid.title, vid.videoId);
    this.api.writeVideoData(vid.url, vid.title, vid.videoId, vid.description, this.dataFromDB[vidID.videoId].likes, vid.views, vid.userId, vid.time);

    // setTimeout(() => {
    var user = this.userFromDB[uid];
    if (likedArr.length == 0) { likedArr.push(''); }
    this.api.writeUserData(user.name, uid, user.profileImage, likedArr, user.viewed, user.uploaded, user.notifications, user.joined);
    // }, 2000);
    // let url = this.dataFromDB[vidID.videoId].url.changingThisBreaksApplicationSecurity;
    // console.log(this.dataFromDB[vidID.videoId].url.changingThisBreaksApplicationSecurity);
    // // console.log('VidID', this.dataFromDB[vidID.videoId].title, vidID.views, this.dataFromDB[vidID.videoId].likes, vidID.time, vidID.description, this.urlMap.get(vidID.videoId));
    // this.writeVideoData(url, this.dataFromDB[vidID.videoId].title, this.dataFromDB[vidID.videoId].videoId, this.dataFromDB[vidID.videoId].description, this.dataFromDB[vidID.videoId].time, this.dataFromDB[vidID.videoId].likes);
    // setTimeout(() => {
    //   db.set(db.ref(this.database, 'videos/' + vidID.videoId), {
    //     title: this.dataFromDB[vidID.videoId].title,
    //     url: this.dataFromDB[vidID.videoId].url,
    //     views: 0,
    //     likes: this.dataFromDB[vidID.videoId].likes,
    //     time: this.dataFromDB[vidID.videoId].timestamp,
    //     description: this.dataFromDB[vidID.videoId].description,
    //     userId: 'ID',
    //     videoId: this.dataFromDB[vidID.videoId].videoId
    //   });
    // }, 3000);
  }

  previewVideo(id: number) {
    console.log('Started Previewing', id);
    var x = document.getElementsByTagName('video')[id];
    x.muted = true;
    x.play();
  }

  stopPreview(id: number) {
    console.log('Stopped Previewing', id);
    var x = document.getElementsByTagName('video')[id];
    x.load();
  }

  addData(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.file = target.files[0];
    }
    console.log(new Date(1669142885888));
  }

  addToStorage() {
    setTimeout(() => this.getLinks(), 2000);
    this.videoLinks.push(this.myUrl);

    // let timestamp = new Date().getTime()
    // console.log(new Date(timestamp)); methods -> .toDateString() / .toLocaleDateString() / .toLocaleTimeString()
  }

  reloadPage() {
    window.location.reload();
  }
}
