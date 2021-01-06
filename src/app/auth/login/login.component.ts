import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.maxLength(360), Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  formLoading = false;

  handleLoginFormSubmit = () => {
    if( this.loginForm.valid ){
      this.formLoading = true;
      this.api.Login(this.loginForm.value)
          .then((res: any) => {
            if (res.data.access_token){
              localStorage.setItem('access_token', res.data.access_token);
              if (localStorage.getItem('access_token') ||
                  localStorage.getItem('access_token') !== undefined){
                this.router.navigateByUrl('/dashboard/main/color');
              }
            }
          })
          .catch(error => {
            this.message.error(error.error && error.error.message);
          })
          .finally(() => {
            this.formLoading = false;
          });
    } else {
      this.message.error('Please fill all fields');
    }
  };

  constructor(private api: ApiService, private message: NzMessageService, private router: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem('access_token')){
      this.router.navigateByUrl('/dashboard/main/color');
    }
  }

}
