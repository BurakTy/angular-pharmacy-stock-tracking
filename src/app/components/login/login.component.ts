import { getLocaleId } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading = false;
  incorrectLogin = false;
  loginForm: FormGroup;
  for = getLocaleId(this.locale);
  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private formBuilder: FormBuilder,
    private authService: AuthServiceService,
    private navService: NavService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required]
    })
  }

  login() {
    this.loading = true;
    let user = Object.assign({}, this.loginForm.value);
    this.authService.login(user).subscribe(
      (res) => {
        localStorage.setItem('token', res.data.token);
        this.loading = false; 
        this.router.navigate(["/"]).then(() => {
          window.location.reload();
        });
      },
      (err) => {
        this.incorrectLogin = true;
        this.loading = false;
      })
  }



}
