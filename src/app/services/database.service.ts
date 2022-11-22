import { Injectable } from '@angular/core';
import { analyticInstance$ } from '@angular/fire/analytics';
import { Database, onValue, ref, set } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  datat = { 'videoURL': '' };
  data!: Object;

  constructor(public db: Database) { }

  writeData(path: string, videoId: string[]) {
    set(ref(this.db, path), {
      videoId: videoId
    });
  }

  readData() {

    const starCountRef = ref(this.db, 'users/');
    onValue(starCountRef, (snapshot) => {
      this.data = snapshot.val();
      // this.data = JSON.parse(JSON.stringify(datas)) as typeof datas;
      // console.log('From localOne', this.data);
    });
    // console.log('From localTwo', typeof (this.data));
    return this.data;
  }
}
