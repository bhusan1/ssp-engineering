import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserLogin } from '../models/user-login.model';
import { User } from '../models/user.model';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;

  constructor(private ngZone: NgZone, private afAuth: AngularFireAuth, private router: Router, private fbService: FirebaseService) {}

  public currentUser: any;
  public userStatus: string;
  public userStatusChanges: BehaviorSubject<string> = new BehaviorSubject<string>(this.userStatus);

  setUserStatus(userStatus: any): void {
    this.userStatus = userStatus;
    this.userStatusChanges.next(userStatus);
  }

  login(userCrdentials: UserLogin) {
    this.afAuth.auth
      .signInWithEmailAndPassword(userCrdentials.email, userCrdentials.password)
      .then((user) => {
        this.updateUserDataInFirestore(user);
        this.fbService
          .getFirestoreCollection('users')
          .ref.where('username', '==', user.user.email)
          .onSnapshot((snap) => {
            snap.forEach((userRef) => {
              this.currentUser = userRef.data();
              // setUserStatus
              this.setUserStatus(this.currentUser);
              if (userRef.data().role !== 'user') {
                this.ngZone.run(() => this.router.navigate(['/']));
              }
              else {
                this.ngZone.run(() => this.router.navigate(['/dashboard']));
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
              // setUserStatus
              this.setUserStatus(this.currentUser);
              // console.log(this.userStatus);
              if (userRef.data().role !== 'user') {
                this.ngZone.run(() => this.router.navigate(['/']));
              }
              else {
                this.ngZone.run(() => this.router.navigate(['/dashboard']));
              }
            });
          });
      }
      else {
        this.ngZone.run(() => this.router.navigate(['/login']));
      }
    });
  }

  updateUserDataInFirestore(user: firebase.auth.UserCredential): void {
    const userData = {
      id: user.user.uid,
      username: user.user.email,
      role: 'user',
      isAdmin: false
    };
    this.fbService.getFirestoreDocument('users', user.user.uid).then((userDataFromFirestore) => {
      if (!userDataFromFirestore.exists) {
        this.fbService.setFirestoreDocument('users/' + user.user.uid, userData);
      }
    });
  }
}
