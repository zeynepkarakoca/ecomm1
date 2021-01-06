import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registrationForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    surname: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(360)]),
    phone: new FormControl('', [Validators.required, Validators.maxLength(25)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password_confirmation: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  formLoading = false;

  constructor(private api: ApiService, private router: Router, private message: NzMessageService) { }


  passwordConfirmationValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (this.registrationForm.controls.password_confirmation.value != this.registrationForm.controls.password.value) {
      return null;
    }
    return { password_confirmation: true };
  }

  handleSubmitForm = () => {
    if (this.registrationForm.valid) {
      this.formLoading = true;
      this.api.Register(this.registrationForm.value).then((res: any) => {
        if ( res.success && res.success === true ) {
          this.router.navigateByUrl('/auth/login');
        }
      })
        .catch(error => {
          this.message.error(error.error && error.error.message);
          console.error(error);
        })
        .finally(() => {
          this.formLoading = false;
        });
    } else {
      this.message.error('Please fill all fields');
    }
  };

  ngOnInit(): void {
    if (localStorage.getItem('access_token')){
      this.router.navigateByUrl('/dashboard/main/color');
    }
  }

}
