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
import { GameStore } from '../state/game.store';
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
    private _adminService: AdminService,
    private _userService: UserService,
    private _gameStore: GameStore,
    private router: Router
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

    // don't know why router.navigate gets called like this but it works
    // should better use route resolver
    //the game does not exists here -> moved on role component page
    //this._gameStore.loadGame(this.loginForm.controls.scenario.value,

          this.router.navigate(['/roles',
            this.loginForm.controls.name.value,
            this.loginForm.controls.surname.value,
            this.loginForm.controls.scenario.value
          ])
    //);
  }

}
