import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    public currUser;

    constructor(public userService: UserService, public router: Router) {
        this.userService.userSubject.subscribe(u => {
            this.currUser = u;
        });
    }

    ngOnInit() {
    }

}
