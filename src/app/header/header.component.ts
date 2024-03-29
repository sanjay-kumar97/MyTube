import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { ApiService } from '../services/api.service';

@Component({
  providers: [AppComponent],
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
  serachTerm: String = '';
  notificationCount: number = 0;
  currUserData: any;

  constructor(private router: Router, private api: ApiService, public app: AppComponent) { }

  searchIcon: boolean = false;
  ngOnInit(): void {

    // this.userName = sessionStorage.getItem('userName');
    setTimeout(() => {
      this.userDetails = this.api.getUserDetails();
      console.log('From Header', { userDetails: this.userDetails });
      this.isLoggedIn = this.api.isLoggedIn();
      this.profileImage = this.userDetails.profileImage;
      this.userName = this.userDetails.displayName;
      if (this.api.auth.currentUser) {
        this.validate = true;
      }
      this.currUserData = this.api.readSpecificUserData(this.userDetails.UID);
      setTimeout(() => {
        let notifyArr = this.currUserData.notifications;
        // this.notificationCount = notifyArr.length;
        notifyArr.forEach((item: { status: string; }) => {
          if (item.status === 'Visible') {
            this.notificationCount += 1;
          }
        });
        console.log({ this: this.notificationCount });
      }, 2000);
      // this.notificationCount = this.app.currUserData.notifications.length;
      console.log(this.currUserData);
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

  navigateToNotificationsPage() {
    this.router.navigate(['/notifications']);
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

  getSearchTerm(e: any) {
    console.log(e.key);
    if (e.key != 'Enter') {
      this.serachTerm += e.key;
    } else {
      this.navigateToSearchPage();
    }
  }

  navigateToSearchPage() {
    this.router.navigate(['/search', this.serachTerm]);
    this.resetSearch();
  }

  resetSearch() {
    this.serachTerm = '';
    var inp = document.getElementsByTagName('input')[0];
    inp.blur();
  }

  public clearSearchInput() {
    var inp = document.getElementsByTagName('input')[0];
    inp.value = '';
  }

  navigateToUploadVideoPage() {
    if (!this.api.isLoggedIn()) {
      sessionStorage.setItem('Prev', 'Upload');
      this.router.navigate(['SignIn']);
    } else {
      this.router.navigate(['Upload']);
    }
    // this.ngOnInit();
  }

  navigateToProfilePage() {
    if (!this.api.isLoggedIn()) {
      sessionStorage.setItem('Prev', 'profile');
      this.router.navigate(['SignIn']);
    } else {
      this.router.navigate(['profile', this.userDetails.UID]);
    }
  }

  navigateToHomePage() {
    this.router.navigate(['Home']);
  }

  manageAccount() {
    if (this.isLoggedIn) {
      this.api.signOut();
      this.router.navigate(['Home']);
    } else {
      let prev = this.router.url;
      sessionStorage.setItem('Prev', prev);
      this.router.navigate(['SignIn']);
    }
    // setTimeout(() => window.location.reload(), 10);
    this.ngOnInit();
  }

  showSearch() {
    const bar = document.getElementById('searchbar');
    console.log(bar);
    if (bar) {
      bar.style.display = 'block';
      // bar.classList.replace('d-flex', 'd-block');
    }
  }

}
