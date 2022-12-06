import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input() sideNavState: boolean = false;

  constructor(private route: Router) { }

  ngOnInit(): void {
  }

  navigateToHome() {
    this.route.navigate(['Home']);
  }

  navigateToLibrary() {
    this.route.navigate(['library']);
  }

}
