import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() sideNavToggled: EventEmitter<any> = new EventEmitter<boolean>();
  menuState: boolean = true;
  userName: any = "";
  isLoggedIn: boolean = false;
  validate: boolean = false;
  profileImage: any;
  userDetails: any;

  constructor(private route: Router, private api: ApiService) { }

  searchIcon: boolean = false;
  ngOnInit(): void {

    // this.userName = sessionStorage.getItem('userName');
    setTimeout(() => {
      this.userDetails = this.api.getUserDetails();
      console.log('Header lol', this.userDetails);
      this.isLoggedIn = this.api.isLoggedIn();
      this.profileImage = this.userDetails.profileImage;
      this.userName = this.userDetails.displayName;
      if (this.api.auth.currentUser) {
        this.validate = true;
      }
    }, 2000);
    // this.isLoggedIn = (sessionStorage.getItem('userName') != "") ? true : false;
    console.log(this.isLoggedIn);

    // console.log('From Header', this.isLoggedIn, (this.api.isLoggedIn()) ? 'true' : 'false');
  }

  sideNavToggle() {
    this.menuState = !this.menuState;
    this.sideNavToggled.emit(this.menuState);
  }

  showIcon() {
    this.searchIcon = true;
  }
  hideIcon() {
    this.searchIcon = false;
  }

  showNotifications() {
    // setTimeout(function () { alert("No new Notifications currently!"); }, 3000);
    // tempAlert("No new notifications!", 3000);
    // function tempAlert(msg: any, duration: number) {
    //   var el = document.createElement("div");
    //   el.setAttribute("style", "position: absolute; bottom: 5%; left: 50%; background-color: white; z-index: 99; min-width: 20%; padding: 10px 20px; transform: translateX(-50%); border: 1px solid #000; border-radius: 10px; transition: ease-in-out 1s;");
    //   el.innerHTML = msg;
    //   setTimeout(function () {
    //     el.parentNode?.removeChild(el);
    //   }, duration);
    //   document.body.appendChild(el);
    // }
    // this.validate = !this.validate;
    // this.ngOnInit();
    // this.api.writeUserLikedData(["fd102256-e90c-40ae-b4fb-1b3a2212f423", "b52958eb-4e7d-4e6b-ab1e-4fdf68d0ed6c"], "hfrCTBJkVLeVjpR6j9PFzceVq6j1");
    // var data: any = this.api.readUserData();
    // var uid = '' + this.api.getUserDetails().UID;
    // setTimeout(() => {
    //   this.api.writeUserData(data[uid].name, uid, ['fd102256-e90c-40ae-b4fb-1b3a2212f423'], [''], [''], data[uid].joined);
    // }, 2000);
  }

  navigateToUploadVideoPage() {
    if (!this.api.isLoggedIn()) {
      sessionStorage.setItem('Prev', 'Upload');
      this.route.navigate(['SignIn']);
    } else {
      this.route.navigate(['Upload']);
    }
    // this.ngOnInit();
  }

  navigateToHomePage() {
    this.route.navigate(['Home']);
  }

  manageAccount() {
    if (this.isLoggedIn) {
      this.api.signOut();
      this.route.navigate(['Home']);
    } else {
      sessionStorage.setItem('Prev', 'Home');
      this.route.navigate(['SignIn']);
    }
    // setTimeout(() => window.location.reload(), 10);
    this.ngOnInit();
  }

}
