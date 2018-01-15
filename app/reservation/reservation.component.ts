import { Component, OnInit, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { DrawerPage } from '../shared/drawer/drawer.page';
import { TextField } from 'ui/text-field';
import { Switch } from 'ui/switch';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { ReservationModalComponent } from "../reservationmodal/reservationmodal.component";
import { Animation, AnimationDefinition } from "ui/animation";
import { View } from "ui/core/view";
import { Color } from 'color';
import * as enums from "ui/enums";
import { Page } from "ui/page";
import { CouchbaseService } from '../services/couchbase.service';

@Component({
    selector: 'app-reservation',
    moduleId: module.id,
    templateUrl: './reservation.component.html'
})
export class ReservationComponent extends DrawerPage implements OnInit {

    reservation: FormGroup;
    showList: boolean = false;

    formLayout: View;
    listLayout: View;
    reservationValue: null;

    reservations: Array<number>;
    docId: string = "reservations";

    constructor(private changeDetectorRef: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private modalService: ModalDialogService,
        private vcRef: ViewContainerRef,
        private page: Page,
        private couchbaseService: CouchbaseService) {
        super(changeDetectorRef);

        this.reservation = this.formBuilder.group({
            guests: 3,
            smoking: false,
            dateTime: ['', Validators.required]
        });

        this.reservationValue = this.reservation.value;

        this.reservations = [];

    }

    ngOnInit() {

    }

    onSmokingChecked(args) {
        let smokingSwitch = <Switch>args.object;
        if (smokingSwitch.checked) {
            this.reservation.patchValue({ smoking: true });
        }
        else {
            this.reservation.patchValue({ smoking: false });
        }
    }

    onGuestChange(args) {
        let textField = <TextField>args.object;

        this.reservation.patchValue({ guests: textField.text });
    }

    onDateTimeChange(args) {
        let textField = <TextField>args.object;

        this.reservation.patchValue({ dateTime: textField.text });
    }

    createModalView(args) {

        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: args,
            fullscreen: false
        };

        this.modalService.showModal(ReservationModalComponent, options)
            .then((result: any) => {
                if (args === "guest") {
                    this.reservation.patchValue({ guests: result });
                }
                else if (args === "date-time") {
                    this.reservation.patchValue({ dateTime: result });
                }
            });

    }

    onSubmit() {
        this.formLayout = <View>this.page.getViewById<View>("formLayout");
        this.listLayout = <View>this.page.getViewById<View>("listLayout");
        this.reservationValue = this.reservation.value;
        this.showList = true;
        this.animateForm();
        
        let doc = this.couchbaseService.getDocument(this.docId);
        if (doc == null) {
            console.log("This is the first reservation");
            this.couchbaseService.createDocument({ "reservations": this.reservationValue }, this.docId);
            console.log(JSON.stringify(this.couchbaseService.getDocument(this.docId)));
        }
        else {
            this.reservations.push(doc.reservations);
            this.reservations.push(this.reservationValue);
            this.couchbaseService.updateDocument(this.docId, { "reservations": this.reservations });
            console.log(JSON.stringify(this.couchbaseService.getDocument(this.docId)));
        }
    }

    animateForm() {
        this.listLayout.animate({
            scale: { x: 0, y: 0 },
            opacity: 0,
            duration: 0
        });
        this.formLayout.animate({
            scale: { x: 0, y: 0 },
            opacity: 0,
            duration: 500
        })
            .then(() => {
                this.listLayout.animate({
                    scale: { x: 1, y: 1 },
                    opacity: 1,
                    duration: 500
                })
            });
    }

}