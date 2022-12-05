import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, signOut } from "firebase/auth";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() sideNavToggled: EventEmitter<any> = new EventEmitter<boolean>();
  menuState: boolean = true;
  userName!: string | null;
  isLoggedIn: boolean = false;

  constructor(private route: Router) { }
  searchIcon: boolean = false;
  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');
    this.isLoggedIn = (sessionStorage.getItem('UID') != null) ? true : false;
    console.log(this.isLoggedIn);
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

  navigateToUploadVideoPage() {
    if (!this.isLoggedIn) {
      this.route.navigate(['SignIn']);
    } else {
      this.route.navigate(['Upload']);
    }
  }

  navigateToHomePage() {
    this.route.navigate(['Home']);
  }

  logoutAccount() {
    const auth = getAuth();
    signOut(auth).then(() => {
      console.log("Sign-out successful.");
      sessionStorage.removeItem('UID');
      sessionStorage.removeItem('userName');
      this.route.navigate(['Home']);
      window.location.reload();
    }).catch((error) => {
      console.log(error);
    });
  }

}
