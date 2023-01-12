import { Injectable } from '@angular/core';
import * as st from '@angular/fire/storage';
import * as db from '@angular/fire/database';
import { getAuth, signOut, GoogleAuthProvider, signInWithPopup } from '@firebase/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private database: db.Database, public storage: st.Storage, private router: Router) { }

  auth = getAuth();
  public DATA: any;

  public setDATA(data: any) {
    this.DATA = data;
  }

  public getDATA() {
    var dataToRet = {};
    Object.assign(dataToRet, this.DATA);
    sessionStorage.setItem('DATA', JSON.stringify(this.DATA));
    return dataToRet;
  }

  signInWithGoogle(page: any) {
    const provider = new GoogleAuthProvider();
    var data = this.readUserData();
    signInWithPopup(this.auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        if (!Object.keys(data).includes(user.uid)) {
          this.writeUserData(user.displayName, user.uid, '' + user.photoURL, [''], [''], [''], [''], new Date().getTime());
        }
        console.log({ token, user });
        if (page == 'profile') {
          this.router.navigate([page, user.uid]);
        } else {
          this.router.navigate([page]);
        }
        if (user.displayName) {
          sessionStorage.setItem('userName', (user.displayName).toString());
        }
        setTimeout(() => window.location.reload(), 1000);
      }).catch((error) => {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // const email = error.customData.email;
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // console.info(errorCode, errorMessage);
        console.log('Error', error);
      });
  }

  getUserDetails() {
    // console.log(this.auth.currentUser);
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

  public getAllData() {
    const dbRef = db.ref(db.getDatabase());
    var data = {};
    db.get(db.child(dbRef, '/')).then((snapshot) => {
      if (snapshot.exists()) {
        data = snapshot.val();
        // Object.assign(this.DATA, data);
        // this.DATA = data;
        this.setDATA(data);
        // console.log('From API', snapshot.val(), typeof (data));
        console.log('From API:', "Got DATA :D", this.getDATA());
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  writeUserData(name: any, userId: any, profileImage: String, liked: String[], viewed: String[], uploaded: String[], notifications: Object[], time: number) {
    db.set(db.ref(this.database, 'users/' + userId), {
      name: name,
      userId: userId,
      viewed: viewed,
      liked: liked,
      uploaded: uploaded,
      joined: time,
      profileImage: profileImage,
      notifications: notifications
    });
  }

  readUserData() {
    const dbRef = db.ref(db.getDatabase());
    var data, dataToReturn = {};
    db.get(db.child(dbRef, 'users/')).then((snapshot) => {
      if (snapshot.exists()) {
        data = snapshot.val();
        Object.assign(dataToReturn, data);
        // console.log('From API', snapshot.val(), typeof (data));
        console.log('From API:', "Returned userData :)");
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    return dataToReturn;
  }

  readSpecificUserData(userId: String) {
    const dbRef = db.ref(db.getDatabase());
    var data, dataToReturn = {};
    db.get(db.child(dbRef, 'users/' + userId)).then((snapshot) => {
      if (snapshot.exists()) {
        data = snapshot.val();
        Object.assign(dataToReturn, data);
        console.log('From API:', "Returned singleUserData :)");
        // console.log('From API', snapshot.val(), typeof (data));
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    return dataToReturn;
  }

  deleteUserData(userId: String) {
    db.remove(db.ref(this.database, 'users/' + userId));
  }

  writeVideoData(url: string, title: string, videoId: string, description: string, likes: number, views: number, userId: any, time: number) {
    db.set(db.ref(this.database, 'videos/' + videoId), {
      title: title,
      url: url,
      views: views,
      likes: likes,
      time: time,
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
        console.log('From API:', "Returned videoData :)");
        // console.log('From API', snapshot.val(), typeof (data));
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    return dataToReturn;
  }

  readSpecificVideoData(videoId: String) {
    const dbRef = db.ref(db.getDatabase());
    var data, dataToReturn = {};
    db.get(db.child(dbRef, 'videos/' + videoId)).then((snapshot) => {
      if (snapshot.exists()) {
        data = snapshot.val();
        Object.assign(dataToReturn, data);
        console.log('From API:', "Returned singleVideoData :)");
        // console.log('From API', snapshot.val(), typeof (data));
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
    var data: any = this.readUserData();
    var uid = '' + this.getUserDetails().UID;
    var uploadedArr: String[];
    var notifyArr: Object[];
    setTimeout(() => {
      uploadedArr = data[uid].uploaded;
      notifyArr = data[uid].notifications;
    }, 2000);

    const storageRef = st.ref(this.storage, videoData.title);
    const uploadTask = st.uploadBytesResumable(storageRef, file);
    var videoId = "";
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        sessionStorage.setItem('Progress', progress.toString());
        // console.log('Upload Done', snapshot);
      },
      (error) => {
        console.log(error.message);
      },
      () => {
        st.getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            console.log('File uploaded to', downloadURL);
            videoId = downloadURL.slice(downloadURL.indexOf("token=") + 6);
            setTimeout(() => {
              console.log(videoId);
              this.writeVideoData(downloadURL, videoData.title, videoId, videoData.description, 0, 0, this.auth.currentUser?.uid, new Date().getTime());
              uploadedArr.push(videoId);
              if (uploadedArr[0] == "") {
                console.log('NULLLLLLL');
                uploadedArr.shift();
              }
              notifyArr.unshift({ action: 'Posted', status: 'Visible', time: new Date().getTime(), userId: uid, videoId: videoId, title: videoData.title });
              if (notifyArr[0] == "") {
                console.log('NULLLLLLL');
                notifyArr.shift();
              }
              this.writeUserData(data[uid].name, data[uid].userId, data[uid].profileImage, data[uid].liked, data[uid].viewed, uploadedArr, notifyArr, data[uid].joined);
            }, 2000);
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