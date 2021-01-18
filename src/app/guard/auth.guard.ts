import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { CanActivate } from '@angular/router';
import { FirebaseService } from 'app/services/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  currentUser: any;
  flag: boolean;
  constructor(private fbService: FirebaseService, private afAuth: AngularFireAuth) { }

  canActivate() {
    this.afAuth.auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        this.fbService
          .getFirestoreCollection('users')
          .ref.where('username', '==', currentUser.email)
          .onSnapshot((snap) => {
            snap.forEach((userRef) => {
              this.currentUser = userRef.data();
              // if (currentUser) {
              //   // check if the route is retricted by role
              //   if (next.data.roles && next.data.roles.indexOf(this.currentUser.role) === -1) {
              //     // role not authorized
              //     this.router.navigate(['/login']);
              //     this.flag = false;
              //   }
              //   else {
              //     this.flag = true;
              //   }
              // }
              this.flag =true;
            
            })
      })
  }
})
return this.flag; 
   
}
}
