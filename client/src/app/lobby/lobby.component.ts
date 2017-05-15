import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../user.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  id: string; // the user id

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _userService: UserService
  ) {
    this.id = this._activatedRoute.snapshot.params.id;
    console.log(this.id);
  }

  ngOnInit() {
  }

  onSelectRole(role: string) {
    console.log(1,role);

    this._userService.getUser(this.id).subscribe(
      (user) => {
        console.log(user);
        
        user.role = role;

        this._userService.updateUser(this.id, user).subscribe(
          (data) => {
            console.log(data);

            this._router.navigate(['gamemap', { 'id': this.id }] );
          });
      }
    );
  }

}
