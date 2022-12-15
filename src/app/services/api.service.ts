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

  signInWithGoogle(page: any) {
    const provider = new GoogleAuthProvider();
    var data = this.readUserData();
    signInWithPopup(this.auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        if (!Object.keys(data).includes(user.uid)) {
          this.writeUserData(user.displayName, user.uid, [''], [''], [''], new Date().getTime());
        }
        console.log({ token, user });
        this.router.navigate([page]);
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

  writeUserData(name: any, userId: any, liked: String[], viewed: String[], uploaded: String[], time: number) {
    db.set(db.ref(this.database, 'users/' + userId), {
      name: name,
      userId: userId,
      viewed: viewed,
      liked: liked,
      uploaded: uploaded,
      joined: time
    });
  }

  readUserData() {
    const dbRef = db.ref(db.getDatabase());
    var data, dataToReturn = {};
    db.get(db.child(dbRef, 'users/')).then((snapshot) => {
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

  deleteUserData(userId: String) {
    db.remove(db.ref(this.database, 'users/' + userId));
  }

  writeVideoData(url: string, title: string, videoId: string, description: string, likes: number, userId: any, time: number) {
    db.set(db.ref(this.database, 'videos/' + videoId), {
      title: title,
      url: url,
      views: 0,
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
        console.log('from get', snapshot.val(), typeof (data));
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
            setTimeout(() => { console.log(videoId); this.writeVideoData(downloadURL, videoData.title, videoId, videoData.description, 0, this.auth.currentUser?.uid, new Date().getTime()); }, 2000);
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