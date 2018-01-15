import { Component, OnInit, Inject, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { DrawerPage } from '../shared/drawer/drawer.page';
import { ReservationService } from '../services/reservation.service';
import { TextField } from 'ui/text-field';
import { Switch } from 'ui/switch';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { ReservationModalComponent } from "../reservationmodal/reservationmodal.component";
import { Animation, AnimationDefinition } from "ui/animation";
import { Page } from "ui/page";
import { View } from "ui/core/view";
import * as enums from "ui/enums";
import { Reservation } from '../shared/reservation';
import { ObservableArray } from 'tns-core-modules/data/observable-array';

@Component({
    selector: 'app-reservation',
    moduleId: module.id,
    templateUrl: './reservation.component.html'
})
export class ReservationComponent extends DrawerPage implements OnInit {

    reservation: FormGroup;
    reservationForm: View;
    reservations: ObservableArray<Reservation>;
    errMess: string;
    showResult: boolean;
    today = Date.now();

    constructor(private changeDetectorRef: ChangeDetectorRef,
        private reservationservice: ReservationService,
        private formBuilder: FormBuilder,
        private modalService: ModalDialogService,
        private page: Page,
        private vcRef: ViewContainerRef) {
        super(changeDetectorRef);

        this.reservation = this.formBuilder.group({
            guests: 3,
            smoking: false,
            dateTime: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.showResult = false;       
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
        console.log(JSON.stringify(this.reservation.value));
        this.reservationservice.addReservation(this.reservation.value);
        this.reservationForm = <View>this.page.getViewById<View>("reservationForm");
        this.reservationForm.animate({
            scale: { x: 0, y: 0 },
            opacity: 0,
            duration: 500,
            curve: enums.AnimationCurve.easeIn
        }).then(() => {
            this.showResult = true;
            this.reservationForm.animate({
                scale: { x: 1, y: 1 },
                opacity: 1,
                duration: 500,
                curve: enums.AnimationCurve.easeIn
            })
        })
            .catch((e) => {
                console.log(e.message);
            });
    }

// Reservation service created !!!!
/*
import { Injectable } from '@angular/core';
import { CouchbaseService } from '../services/couchbase.service';
import {Reservation} from '../shared/reservation';

@Injectable()
export class ReservationService {    
    docId: string = "reservations";
    reservations: Array<Reservation>;
     constructor(private couchbaseService: CouchbaseService) {
            this.reservations = [];
            let doc = this.couchbaseService.getDocument(this.docId);
            if( doc == null) {
              this.couchbaseService.createDocument({"reservations": []}, this.docId);
              console.log("First reservation added");
            }
            else {
              this.reservations = doc.reservations;
            }
    }
    addReservation(reservation: Reservation){        
        this.reservations.push(reservation);
        console.log(JSON.stringify(this.reservations));
        this.couchbaseService.updateDocument(this.docId, {"reservations": this.reservations});     
    }    
} */
}