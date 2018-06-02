import { Component } from '@angular/core';
import { ToasterService, Toaster, ToasterConfig } from 'angular2-toaster';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'app';
    public config: ToasterConfig = new ToasterConfig({
        positionClass: 'toast-bottom-right',
        timeout: 5000,
        mouseoverTimerStop: true
    });
    constructor(public toasterService: ToasterService){}
}
