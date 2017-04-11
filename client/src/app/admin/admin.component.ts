import { Component, OnInit } from '@angular/core';

import { UserService } from '../user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  users: any[];

  constructor(private _userService: UserService) { }

  ngOnInit() {

    this._userService.getUsers().subscribe(
      (data) => {
        console.log(data);
        this.users = data;
      }
    );
  }

}
