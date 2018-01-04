import {ViewChild, ChangeDetectorRef, AfterViewInit} from "@angular/core";
import { RadSideDrawerComponent, SideDrawerType } from "nativescript-pro-ui/sidedrawer/angular";
import { RadSideDrawer } from 'nativescript-pro-ui/sidedrawer';

export class DrawerPage implements AfterViewInit {

    @ViewChild(RadSideDrawerComponent) protected drawerComponent: RadSideDrawerComponent;
    protected drawer: RadSideDrawer;

    constructor(private _changeDetectorRef: ChangeDetectorRef) {
    }

    ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
        this._changeDetectorRef.detectChanges();
    }

    protected openDrawer() {
        this.drawer.showDrawer();
    }

    protected closeDrawer() {
        this.drawer.closeDrawer();
    }
}