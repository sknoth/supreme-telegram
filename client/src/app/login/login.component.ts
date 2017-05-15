import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy
 } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    @Inject(FormBuilder) _formBuilder : FormBuilder,
    private _userService: UserService,
    private _router: Router
  ) {

    this.loginForm = _formBuilder.group( {
        name : ['', Validators.required],
        surname: ''
    } );
  }

  ngOnInit() { }

  onSubmit() {

    let user = {
      name : this.loginForm.controls.name.value,
      surname: this.loginForm.controls.surname.value
    };

    this._userService.addUser(user).subscribe(
      (data) => {
        console.log(data);
        this._router.navigate(['lobby', { 'id': data._id }] );
      }
    );
  }

}
