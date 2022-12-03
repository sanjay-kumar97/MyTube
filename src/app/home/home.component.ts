import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
// import { Database, onValue, ref, set } from '@angular/fire/database';
// import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import * as st from '@angular/fire/storage';
import * as db from '@angular/fire/database';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
// import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @Output() toggleSidebarForMe: EventEmitter<boolean> = new EventEmitter();

  constructor(private database: db.Database, public storage: st.Storage, private sanitizer: DomSanitizer, private route: Router) { }

  links: any;
  videoId = '';
  file: any;
  dataFromDB: any;
  loader: boolean = true;
  showTitle: boolean = false;
  myUrl!: SafeResourceUrl;
  // arrayToIterrate: Array<any> = [];
  videoLinks: Array<SafeResourceUrl> = [];
  videoMap: any;
  urlMap: any;

  ngOnInit(): void {
    this.setLinks();
    this.getLinks();
    // let link = "https://firebasestorage.googleapis.com/v0/b/mytube-v0.appspot.com/o/Okay%20Meme%20Template.mp4?alt=media&token=876b81a9-9710-46d1-8047-96d3e2c4f831";
    // this.myUrl = this.sanitizer.bypassSecurityTrustResourceUrl(link);
    // this.videoLinks.push(this.myUrl);
    this.writeUserData('Peter', 'abx89v0908bns');
  }

  setLinks() {
    console.log('From SetLinks');
    setTimeout(() => {
      console.log('From setLinks', this.dataFromDB);
      let urlMap = new Map()
      for (let i = 0; i < Object.keys(this.dataFromDB).length; i++) {
        let id = this.dataFromDB[Object.keys(this.dataFromDB)[i]].videoId;
        let link = this.dataFromDB[Object.keys(this.dataFromDB)[i]].url;
        urlMap.set(id, link);

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
      setTimeout(() => this.showTitle = true, 1000);
    }, 3000);
    // for (let i = 0; i < this.videoLinks.length; i++) {
    //   this.videoLinks[i].replace('u.be', 'ube.com/embed');
    //   this.dbService.writeData(this.videoLinks[i], i);
    // }
    // this.links = this.videoLinks.sort(() => Math.random() - 0.5);
    console.log('END of SetLinks');
  }

  writeUserData(name: string, userId: string) {
    db.set(db.ref(this.database, 'users/' + userId), {
      name: name,
      userId: userId,
      viewed: [''],
      liked: [''],
      uploaded: [''],
      joined: new Date().toDateString()
    });
    // this.videoId += 1;
  }

  getLinks() {
    const starCountRef = db.ref(this.database, 'videos/');
    db.onValue(starCountRef, (snapshot) => {
      this.dataFromDB = snapshot.val();
      console.log('From getLinks', this.dataFromDB);
    });
    // this.data = this.dbService.readData();
    setTimeout(() => {
      this.links = Object.keys(this.dataFromDB);
      this.links = this.links.sort(() => Math.random() - 0.5);
      console.log('From nowhere', this.links, this.dataFromDB[this.links[0]]);
      let videoMap = new Map();
      for (let i = 0; i < Object.keys(this.dataFromDB).length; i++) {
        let link = this.dataFromDB[Object.keys(this.dataFromDB)[i]].url;
        this.myUrl = this.sanitizer.bypassSecurityTrustResourceUrl(link);
        this.dataFromDB[Object.keys(this.dataFromDB)[i]].url = this.myUrl;
        console.log(this.dataFromDB[Object.keys(this.dataFromDB)[i]].title, Object.values(this.dataFromDB)[i]);
        // videoMap.set(this.dataFromDB[Object.keys(this.dataFromDB)[i]].title.toString(), Object.values(this.dataFromDB)[i]);
        for (let i = 0; i < this.links.length; i++) {
          videoMap.set(this.dataFromDB[Object.keys(this.dataFromDB)[i]].title.toString(), this.dataFromDB[this.links[i]]);
        }
      }
      this.videoMap = videoMap;
      setTimeout(() => { console.log(this.videoMap) }, 2000);
    }, 3000);
    // setTimeout(() => { for (let i = 0; i < 3; i++) { console.log('From Local', this.dataFromDB[Object.keys(this.dataFromDB)[i]].url); } }, 2000);
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


    console.log(e.target.checked, this.dataFromDB);
    if (e.target.checked) {
      this.route.navigate(['SignIn']);
      if (false) {
        this.dataFromDB[vidID.videoId].likes += 1;
      }
    } else {
      this.dataFromDB[vidID.videoId].likes -= 1;
    }
    let url = this.dataFromDB[vidID.videoId].url.changingThisBreaksApplicationSecurity;
    console.log(this.dataFromDB[vidID.videoId].url.changingThisBreaksApplicationSecurity);
    // console.log('VidID', this.dataFromDB[vidID.videoId].title, vidID.views, this.dataFromDB[vidID.videoId].likes, vidID.time, vidID.description, this.urlMap.get(vidID.videoId));
    this.writeVideoData(url, this.dataFromDB[vidID.videoId].title, this.dataFromDB[vidID.videoId].videoId, this.dataFromDB[vidID.videoId].description, this.dataFromDB[vidID.videoId].time, this.dataFromDB[vidID.videoId].likes);
    setTimeout(() => {
      db.set(db.ref(this.database, 'videos/' + vidID.videoId), {
        title: this.dataFromDB[vidID.videoId].title,
        url: this.dataFromDB[vidID.videoId].url,
        views: 0,
        likes: this.dataFromDB[vidID.videoId].likes,
        time: this.dataFromDB[vidID.videoId].timestamp,
        description: this.dataFromDB[vidID.videoId].description,
        userId: 'ID',
        videoId: this.dataFromDB[vidID.videoId].videoId
      });
    }, 3000);
  }

  getView(e: Event) {
    console.log('clicked');
  }

  addData(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.file = target.files[0];
    }
    console.log(new Date(1669142885888));
  }

  writeVideoData(url: string, title: string, videoId: string, description: string, timestamp: number, likes: number) {
    db.set(db.ref(this.database, 'videos/' + videoId), {
      title: title,
      url: url,
      views: 0,
      likes: likes,
      time: timestamp,
      description: description,
      userId: 'ID',
      videoId: videoId
    });
    // this.videoId += 1;
  }

  addToStorage() {
    setTimeout(() => this.getLinks(), 2000);
    // var inputs = document.getElementsByTagName('input');
    // let uid = inputs[1].value;
    // let vid = inputs[2].value;
    // console.log({ uid, vid });
    // inputs[1].value = '';
    // inputs[2].value = '';
    // let vids = [];
    // let size = Object.keys(this.data).length;
    // console.log('Data from Push', Object.keys(this.data), typeof (this.data), size);
    // for (let i = 0; i < size; i++) {
    //   console.log('From loop', this.data[i]);
    // }
    // vids.push(vid);
    // if (uid != '' && vid != '') {
    //   this.dbService.writeData('users/' + uid, vids);
    // } else {
    //   console.log('Err in adding to db');
    // }
    // this.getLinks();

    this.videoLinks.push(this.myUrl);

    //   const storageRef = st.ref(this.storage, this.file.name);
    //   const uploadTask = st.uploadBytesResumable(storageRef, this.file);
    //   uploadTask.on('state_changed',
    //     (snapshot) => {
    //       console.log('Upload Done');
    //     },
    //     (error) => {
    //       console.log(error.message);
    //     },
    //     () => {
    //       st.getDownloadURL(uploadTask.snapshot.ref)
    //         .then((downloadURL) => {
    //           console.log('File uploaded to', downloadURL);
    //           this.videoId = downloadURL.slice(downloadURL.indexOf("token=") + 6);
    //           setTimeout(() => { console.log(this.videoId); this.writeUserData(downloadURL, this.file.name, this.videoId); }, 2000);
    //         });
    //     }
    //   )
    //   console.log(this.file);

    // let timestamp = new Date().getTime()
    // console.log(new Date(timestamp)); methods -> .toDateString() / .toLocaleDateString() / .toLocaleTimeString()
  }

  redirectToHome() {
    this.route.navigate(['Home']);
  }
}