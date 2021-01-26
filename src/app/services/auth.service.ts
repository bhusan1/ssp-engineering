import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { UserLogin } from '../models/user-login.model';
import { User } from '../models/user.model';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;


  public currentUser: any;
  public userStatus: string;
  public userStatusChanges = new Subject<string>();

  constructor(private ngZone: NgZone, private afAuth: AngularFireAuth, private router: Router, private fbService: FirebaseService) {
    this.userStatusChanges.subscribe(userDetails => {
      this.currentUser = userDetails;
      console.log("inside subcribered",userDetails,this.currentUser);
    })
  }


  setUserStatus(userStatus: any): void {
    this.userStatus = userStatus;
    this.userStatusChanges.next(userStatus);
  }

  

  login(userCrdentials: UserLogin) {
    this.afAuth.auth
      .signInWithEmailAndPassword(userCrdentials.email, userCrdentials.password)
      .then((user) => {        
        this.fbService
          .getFirestoreCollection('users')
          .ref.where('username', '==', user.user.email)
          .onSnapshot((snap) => {
            snap.forEach((userRef) => {
              this.currentUser = userRef.data();
              console.log("User >>>>>",user)
              console.log("User >>>>",this.currentUser);
              this.updateUserDataInFirestore(user);
              // setUserStatus
              this.setUserStatus(this.currentUser);
              if (userRef.data().isAdmin) {
                this.ngZone.run(() => this.router.navigate(['/admindashboard']));
              }
              else {
                this.ngZone.run(() => this.router.navigate(['/userdashboard']));
              }
            });
          });
      })
      .catch((err) => err);
  }

  logout(): void {
    this.afAuth.auth
      .signOut()
      .then(() => {
        // set current user to null to be logged out
        debugger;
        this.currentUser = null;
        // set the listenener to be null, for the UI to react
        this.setUserStatus(null);
        this.ngZone.run(() => this.router.navigate(['/login']));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getLoggedInUser(): any {
    return this.currentUser;
  }

  userChanges(): void {
    this.afAuth.auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        this.fbService
          .getFirestoreCollection('users')
          .ref.where('username', '==', currentUser.email)
          .onSnapshot((snap) => {
            snap.forEach((userRef) => {
              this.currentUser = userRef.data();
              console.log("userRef.data() >>",userRef.data());
              // setUserStatus
              this.setUserStatus(this.currentUser);
              // console.log(this.userStatus);
              if (userRef.data().isAdmin) {
                this.ngZone.run(() => this.router.navigate(['/admindashboard']));
              }
              else {
                this.ngZone.run(() => this.router.navigate(['/userdashboard']));
              }
            });
          });
      }
      else {
        //this.ngZone.run(() => this.router.navigate(['/login']));
      }
    });
  }

  updateUserDataInFirestore(user: firebase.auth.UserCredential): void {
    // this need to set at signup form
    const userData = {
      id: user.user.uid,
      username: user.user.email,      
      isAdmin: false
    };
    this.fbService.getFirestoreDocument('users', user.user.uid).then((userDataFromFirestore) => {
      if (!userDataFromFirestore.exists) {
        this.fbService.setFirestoreDocument('users/' + user.user.uid, userData);
      }
    });
  }
}
