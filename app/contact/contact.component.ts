import { Component, ChangeDetectorRef } from '@angular/core';
import { DrawerPage } from '../shared/drawer/drawer.page';
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import * as Email from 'nativescript-email';
import * as Phone from 'nativescript-phone';
import * as permissions from "nativescript-permissions";
declare var android;

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

    callRestaurant() {
        permissions.requestPermission(android.Manifest.permission.CALL_PHONE,
            "App Needs This Permission To Make Phone Calls")
            .then(() => {
                console.log("Got Permission!");
                Phone.dial("+852 1234 5678", false);
            })
            .catch(() => {
                console.log("Permission Denied!");
            });
    }

}