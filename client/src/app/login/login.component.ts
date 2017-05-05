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

import { UserService } from '../user.service';
import {AdminService} from '../admin.service';
import {IScenario, IUser} from "../admin.interfaces";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  scenarios:IScenario[];



  constructor(
    @Inject(FormBuilder) _formBuilder : FormBuilder,
    private _adminService:AdminService, private router: Router
  ) {



    this.loginForm = _formBuilder.group( {
        name : ['', Validators.required],
        surname: ['', Validators.required],
        scenario: ['', Validators.required],
    } );

    _adminService.getScenarios().subscribe((v)=>{
        this.scenarios = v;
        //console.log(this.scenarios);
    })

  }

  ngOnInit() { }

  onSubmit() {

    this.router.navigate(['/roles',this.loginForm.controls.name.value,this.loginForm.controls.surname.value,this.loginForm.controls.scenario.value]);

  }

}
