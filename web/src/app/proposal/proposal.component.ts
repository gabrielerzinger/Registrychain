import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {UserService} from '../services/user.service';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit {

    constructor(public router: Router, public userService: UserService) {
        if(router.url == '/logout') this.logout();
    }

    ngOnInit() {
    }

    logout(){
        this.userService.logout();
    }

}
