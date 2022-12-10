import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  constructor(private api: ApiService) { }

  loader: boolean = true;

  ngOnInit(): void {
    setTimeout(() => this.loader = false, 2000);
  }

  signInWithGoogle() {
    var page = sessionStorage.getItem('Prev');
    this.api.signInWithGoogle(page);
    // this.route.navigate([sessionStorage.getItem('Prev')])
  }

}
