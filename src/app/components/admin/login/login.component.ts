import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserLogin } from '../../../models/user-login.model';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: any;
  user: firebase.User;

  constructor(private fb: FormBuilder, public router: Router, public authService: AuthService) {}

  ngOnInit() {
    this.buildForm();
    this.authService.userChanges();
  }

  buildForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    const user: UserLogin = {
      email: this.loginForm.value.username,
      password: this.loginForm.value.password
    };
    this.login(user);
  }

  login(user: UserLogin) {
    this.authService.login(user);
  }
}
