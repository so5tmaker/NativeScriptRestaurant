import { Component, ChangeDetectorRef } from '@angular/core';
import { DrawerPage } from '../shared/drawer/drawer.page';

@Component({
    selector: 'app-contact',
    moduleId: module.id,
    templateUrl: './contact.component.html'
})
export class ContactComponent extends DrawerPage {

    constructor(private changeDetectorRef: ChangeDetectorRef) {
        super(changeDetectorRef);
    }

}