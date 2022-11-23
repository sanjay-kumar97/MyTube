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

  videoLinks: Array<SafeResourceUrl> = [
  ];

  links: any;
  videoId = '';
  file: any;
  dataFromDB: any;
  loader: boolean = true;
  myUrl!: SafeResourceUrl;

  ngOnInit(): void {
    this.setLinks();
    this.getLinks();
    // let link = "https://firebasestorage.googleapis.com/v0/b/mytube-v0.appspot.com/o/Okay%20Meme%20Template.mp4?alt=media&token=876b81a9-9710-46d1-8047-96d3e2c4f831";
    // this.myUrl = this.sanitizer.bypassSecurityTrustResourceUrl(link);
    // this.videoLinks.push(this.myUrl);
  }

  setLinks() {
    console.log('From SetLinks');
    setTimeout(() => {
      console.log(this.dataFromDB);
      for (let i = 0; i < Object.keys(this.dataFromDB).length; i++) {
        let link = this.dataFromDB[Object.keys(this.dataFromDB)[i]].url;
        this.myUrl = this.sanitizer.bypassSecurityTrustResourceUrl(link);
        console.log(this.myUrl);
        this.videoLinks.push(this.myUrl);
        // setTimeout(() => this.videoLinks.push(this.myUrl), 2000);
      }
      this.videoLinks = this.videoLinks.sort(() => Math.random() - 0.5);
      console.log(this.videoLinks);
      this.loader = false;
    }, 3000);
    // for (let i = 0; i < this.videoLinks.length; i++) {
    //   this.videoLinks[i].replace('u.be', 'ube.com/embed');
    //   this.dbService.writeData(this.videoLinks[i], i);
    // }
    // this.links = this.videoLinks.sort(() => Math.random() - 0.5);
    console.log('END of SetLinks');
  }

  writeUserData(url: string, title: string, videoId: string) {
    db.set(db.ref(this.database, 'videos/' + videoId), {
      title: title,
      url: url,
      views: 0,
      likes: 0,
      time: 0
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
    setTimeout(() => { this.links = Object.keys(this.dataFromDB); }, 2000);
    // setTimeout(() => { for (let i = 0; i < 3; i++) { console.log('From Local', this.dataFromDB[Object.keys(this.dataFromDB)[i]].url); } }, 2000);

  }

  toggleSidebar() {
    this.toggleSidebarForMe.emit();
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
