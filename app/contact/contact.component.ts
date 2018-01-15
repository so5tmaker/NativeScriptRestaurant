import { Component, ChangeDetectorRef } from '@angular/core';
import { DrawerPage } from '../shared/drawer/drawer.page';
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import * as Email from 'nativescript-email';

@Component({
    selector: 'app-contact',
    moduleId: module.id,
    templateUrl: './contact.component.html'
})
export class ContactComponent extends DrawerPage {

    constructor(private changeDetectorRef: ChangeDetectorRef,
        private fonticon: TNSFontIconService) {
        super(changeDetectorRef);
    }

    sendEmail() {

        Email.available()
          .then((avail: boolean) => {
            if (avail) {
              Email.compose({
                to: ['confusion@food.net'],
                subject: '[ConFusion]: Query',
                body: 'Dear Sir/Madam:'
              });
            }
            else
              console.log('No Email Configured');
          })
    
      }

}