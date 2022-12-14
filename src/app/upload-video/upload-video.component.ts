import { NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Alert } from 'bootstrap';
import gsap from 'gsap';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.scss']
})
export class UploadVideoComponent implements OnInit {

  constructor(private api: ApiService, private route: Router) { }

  file: any;
  dataFromDB: any;
  links: any;
  userId: any;
  videoData = { 'title': '', 'videoId': '', 'description': '' };
  progress: any = '';

  ngOnInit(): void {
    this.getLinks();
    setTimeout(() => this.userId = this.api.getUserDetails().UID);
  }

  getFile(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.file = target.files[0];
    }
    console.log(this.file.name);
  }

  getTitle(event: Event) {
    const target = event.target as HTMLInputElement;
    this.videoData.title = target.value;
  }

  getDescription(event: Event) {
    const target = event.target as HTMLInputElement;
    this.videoData.description = target.value;
  }

  getLinks() {
    this.dataFromDB = this.api.readVideoData();
    // const starCountRef = db.ref(this.database, 'videos/');
    // db.onValue(starCountRef, (snapshot) => {
    //   this.dataFromDB = snapshot.val();
    //   console.log('From getLinks', this.dataFromDB);
    // });
    // setTimeout(() => console.log('From outer block', this.dataFromDB), 2000);
    // this.data = this.dbService.readData();
    // setTimeout(() => { this.links = Object.keys(this.dataFromDB); }, 2000);
    // setTimeout(() => { for (let i = 0; i < 3; i++) { console.log('From Local', this.dataFromDB[Object.keys(this.dataFromDB)[i]].url); } }, 2000);

  }

  // writeVideoData(url: string, title: string, videoId: string, description: string, timestamp: number) {
  //   db.set(db.ref(this.database, 'videos/' + videoId), {
  //     title: title,
  //     url: url,
  //     views: 0,
  //     likes: 0,
  //     time: timestamp,
  //     description: description,
  //     userId: 'ID',
  //     videoId: videoId
  //   });
  // this.videoId += 1;
  // }

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

    // this.videoLinks.push(this.myUrl);
    const progressbar: HTMLElement | null = document.getElementById('bar');
    progressbar!.style.visibility = 'visible';
    sessionStorage.setItem('Progress', '0');
    this.progress = sessionStorage.getItem('Progress');
    setTimeout(() => {
      this.api.writeToStorage(this.file, this.videoData);
      const trackProgress = setInterval(() => {
        this.progress = parseInt("" + sessionStorage.getItem('Progress'));
        progressbar!.style.width = `${Math.floor(this.progress)}%`;
        progressbar!.innerText = `${Math.ceil(this.progress)}%`;
        if (this.progress === 100) {
          console.log('Done Done Done Done Done!!!!!!!');
          clearInterval(trackProgress);
          this.progress = '';
          document.getElementsByTagName('input')[1].value = '';
          document.getElementsByTagName('textarea')[0].value = '';
          document.getElementsByTagName('input')[2].value = '';
          progressbar!.innerText = 'Upload Done!';
        }
      }, 100);
    }, 2000);

    // const storageRef = st.ref(this.storage, this.file.name);
    // const uploadTask = st.uploadBytesResumable(storageRef, this.file);
    // uploadTask.on('state_changed',
    //   (snapshot) => {
    //     console.log('Upload Done');
    //   },
    //   (error) => {
    //     console.log(error.message);
    //   },
    //   () => {
    //     st.getDownloadURL(uploadTask.snapshot.ref)
    //       .then((downloadURL) => {
    //         console.log('File uploaded to', downloadURL);
    //         this.videoData.videoId = downloadURL.slice(downloadURL.indexOf("token=") + 6);
    //         let timestamp = new Date().getTime()
    //         setTimeout(() => { console.log(this.videoData.videoId); this.writeVideoData(downloadURL, this.videoData.title, this.videoData.videoId, this.videoData.description, timestamp); }, 2000);
    //       });
    //     alert('Done :)');
    //     this.redirectToHome();
    //   }
    // )
    // console.log(this.file);
    // console.log(new Date(timestamp)); methods -> .toDateString() / .toLocaleDateString() / .toLocaleTimeString()
  }

  redirectToHome() {
    this.route.navigate(['Home']);
  }

}
