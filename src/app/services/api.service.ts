import { Injectable } from '@angular/core';
import * as st from '@angular/fire/storage';
import * as db from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private database: db.Database, public storage: st.Storage) { }

  writeUserData(name: string, userId: string, imgSrc: string) {
    db.set(db.ref(this.database, 'users/' + userId), {
      name: name,
      userId: userId,
      viewed: [''],
      liked: [''],
      uploaded: [''],
      profileImage: imgSrc,
      joined: new Date().toDateString()
    });
  }

  readUserData() {
    const starCountRef = db.ref(this.database, 'users/');
    var dataFromDB: any;
    db.onValue(starCountRef, (snapshot) => {
      dataFromDB = snapshot.val();
      console.log('From getUserData', dataFromDB);
    });
    return dataFromDB;
  }

  writeVideoData(url: string, title: string, videoId: string, description: string, timestamp: number, likes: number, userId: string) {
    db.set(db.ref(this.database, 'videos/' + videoId), {
      title: title,
      url: url,
      views: 0,
      likes: likes,
      time: timestamp,
      description: description,
      userId: userId,
      videoId: videoId
    });
  }

  readVideoData() {
    const starCountRef = db.ref(this.database, 'videos/');
    var dataFromDB: any;
    db.onValue(starCountRef, (snapshot) => {
      dataFromDB = snapshot.val();
      console.log('From getVideoData', dataFromDB);
    });
    return dataFromDB;
  }

  writeToStorage(file: any, videoId: string) {
    const storageRef = st.ref(this.storage, file.name);
    const uploadTask = st.uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed',
      (snapshot) => {
        console.log('Upload Done', snapshot);
      },
      (error) => {
        console.log(error.message);
      },
      () => {
        st.getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            console.log('File uploaded to', downloadURL);
            videoId = downloadURL.slice(downloadURL.indexOf("token=") + 6);
            setTimeout(() => { console.log(videoId); this.writeUserData(downloadURL, file.name, videoId); }, 2000);
          });
      }
    )
  }

}
