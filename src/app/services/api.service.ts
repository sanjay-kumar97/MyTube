import { Injectable } from '@angular/core';
import * as st from '@angular/fire/storage';
import * as db from '@angular/fire/database';
import { getAuth, signOut, User } from '@firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private database: db.Database, public storage: st.Storage) { }

  auth = getAuth();

  getUserDetails() {
    console.log(this.auth.currentUser);
    let userDetails = { displayName: this.auth.currentUser?.displayName, profileImage: this.auth.currentUser?.photoURL, UID: this.auth.currentUser?.uid };
    // if (this.auth.currentUser != null) {
    return userDetails;
  }

  isLoggedIn() {
    // const user = this.auth.currentUser;
    // const val = this.auth.onAuthStateChanged((user) => {
    //   if(user) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // })

    // return val() ? true : false;
    return (this.auth.currentUser) ? true : false;
  }

  signOut() {
    if (this.auth.currentUser) {
      signOut(this.auth).then(() => {
        console.log("Sign-out successful.");
        sessionStorage.setItem('userName', "");
      }).catch((error) => {
        console.log(error);
      });
    }
    setTimeout(() => window.location.reload(), 10);
  }

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

  deleteUserData(userId: String) {
    db.remove(db.ref(this.database, 'users/' + userId));
  }

  writeVideoData(url: string, title: string, videoId: string, description: string, timestamp: number, likes: number, userId: any) {
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
    const dbRef = db.ref(db.getDatabase());
    var data, dataToReturn = {};
    db.get(db.child(dbRef, 'videos/')).then((snapshot) => {
      if (snapshot.exists()) {
        data = snapshot.val();
        Object.assign(dataToReturn, data);
        console.log('from get', snapshot.val(), typeof (data));
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    return dataToReturn;
  }

  deleteVideoData(videoId: String) {
    db.remove(db.ref(this.database, 'videos/' + videoId));
    console.log('Video Removed from DB!');
  }

  writeToStorage(file: any, videoData: any) {
    const storageRef = st.ref(this.storage, videoData.title);
    const uploadTask = st.uploadBytesResumable(storageRef, file);
    var videoId = "";
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
            setTimeout(() => { console.log(videoId); this.writeVideoData(downloadURL, videoData.title, videoId, videoData.description, new Date().getTime(), 0, this.auth.currentUser?.uid); }, 2000);
          });
      }
    )
  }

  removeFromStorage(title: String, id: String) {
    const Ref = st.ref(this.storage, '/' + title);
    st.deleteObject(Ref).then(() => {
      console.log('Video Deleted Successfully!');
      this.deleteVideoData(id);
    }).catch((error) => {
      console.log(error);
    });
  }
}
