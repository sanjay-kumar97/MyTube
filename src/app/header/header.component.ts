import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() sideNavToggled: EventEmitter<any> = new EventEmitter<boolean>();
  menuState: boolean = true;

  constructor(private route: Router) { }
  searchIcon: boolean = false;
  ngOnInit(): void {
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
    if (true) {
      this.route.navigate(['SignIn']);
    } else {
      this.route.navigate(['Upload']);
    }
  }

  navigateToHomePage() {
    this.route.navigate(['Home']);
  }
}
