import { Component, OnInit } from '@angular/core';

import {UserService} from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    public user;

    constructor(public userService: UserService) {
        userService.userSubject.subscribe(u => this.user = u);
    }

    ngOnInit() {
    }

}
