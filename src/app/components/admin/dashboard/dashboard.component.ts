import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [AuthService]
})
export class DashboardComponent implements OnInit, OnDestroy {
  @Output() userAuthStatus = new EventEmitter<any>();


  currentUser: any;

  constructor(public authService: AuthService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  userStatus = this.authService.userStatus;
  
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  ngOnInit() {
    this.authService.userChanges();    
    this.authService.userStatusChanges.subscribe((x) => {
      this.userStatus = x;
      this.userAuthStatus.emit(this.userStatus);
      this.currentUser =  this.authService.currentUser;
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
