import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  userName!: any;
  isLoggedIn!: boolean;

  constructor(private route: Router, private api: ApiService) { }
  searchIcon: boolean = false;
  ngOnInit(): void {
    const userDetails = this.api.getUserDetails();
    this.userName = userDetails?.displayName;
    console.log({ userDetails });
    setTimeout(() => { this.isLoggedIn = (this.api.isLoggedIn()) ? true : false; console.log(this.isLoggedIn); }, 2000);
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
    tempAlert("No new notifications!", 3000);
    function tempAlert(msg: any, duration: number) {
      var el = document.createElement("div");
      el.setAttribute("style", "position: absolute; bottom: 5%; left: 50%; background-color: white; z-index: 99; min-width: 20%; padding: 10px 20px; transform: translateX(-50%); border: 1px solid #000; border-radius: 10px; transition: ease-in-out 1s;");
      el.innerHTML = msg;
      setTimeout(function () {
        el.parentNode?.removeChild(el);
      }, duration);
      document.body.appendChild(el);
    }
  }

  navigateToUploadVideoPage() {
    if (!this.api.isLoggedIn()) {
      this.route.navigate(['SignIn']);
    } else {
      this.route.navigate(['Upload']);
    }
    // this.ngOnInit();
  }

  navigateToHomePage() {
    this.route.navigate(['Home']);
  }

  logoutAccount() {
    this.api.signOut();
    this.route.navigate(['Home']);
    // setTimeout(() => window.location.reload(), 10);
    this.ngOnInit();
  }

}
