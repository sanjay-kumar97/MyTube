import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  constructor(private route: Router) { }

  loader: boolean = true;

  ngOnInit(): void {
    setTimeout(() => this.loader = false, 2000);
  }

  signInWithGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        console.log({ token, user });
        this.route.navigate(['Home']);
        if (user.displayName) {
          sessionStorage.setItem('userName', (user.displayName).toString());
        }
        setTimeout(() => window.location.reload(), 1000);
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.info(errorCode, errorMessage);
      });
  }

}
