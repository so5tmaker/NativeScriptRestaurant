import { Component, OnInit, Inject, ChangeDetectorRef, ViewContainerRef, animate } from '@angular/core';
import { DrawerPage } from '../shared/drawer/drawer.page';
import { TextField } from 'ui/text-field';
import { Switch } from 'ui/switch';
import { Validators, FormBuilder, FormGroup} from '@angular/forms';
import { DatePipe } from '@angular/common';

import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { ReservationModalComponent } from "../reservationmodal/reservationmodal.component";
import { Page } from "ui/page";
import { Animation, AnimationDefinition } from "ui/animation";
import { View } from "ui/core/view";
import * as enums from "ui/enums";
import { CouchbaseService } from '../services/couchbase.service';


@Component({
    selector: 'app-reservation',
    moduleId: module.id,
    templateUrl: './reservation.component.html'
})
export class ReservationComponent extends DrawerPage implements OnInit {

    reservation: FormGroup;
    showResults: boolean = false;
    docId: string = "reservations";

    reservations: Array<string>;

    constructor(private changeDetectorRef: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private _modalService: ModalDialogService, 
        private vcRef: ViewContainerRef,
        private page: Page,
        private couchbaseService: CouchbaseService) {
            super(changeDetectorRef);
            this.reservation = this.formBuilder.group({
                guests: 3,
                smoking: false,
                dateTime: ['', Validators.required]
            });

            this.reservations = [];

            let doc = this.couchbaseService.getDocument(this.docId);
            if( doc == null) {
                this.couchbaseService.createDocument({"reservations": []}, this.docId);
            }
            else {
                this.reservations = doc.reservations;
            }
    }

    ngOnInit() {

    }

    createModalView(args) {

        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: args,
            fullscreen: false
        };

        this._modalService.showModal(ReservationModalComponent, options)
            .then((result: any) => {
                if (args === "guest") {
                    this.reservation.patchValue({guests: result});
                }
                else if (args === "date-time") {
                    this.reservation.patchValue({ dateTime: result});
                }
            });

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

        this.reservation.patchValue({ guests: textField.text});
    }

    onDateTimeChange(args) {
        let textField = <TextField>args.object;

        this.reservation.patchValue({ dateTime: textField.text });
    }

    onSubmit() {
        console.log(JSON.stringify(this.reservation.value));
        
        this.reservations.push(JSON.stringify(this.reservation.value));
        this.couchbaseService.updateDocument(this.docId, {"reservations": this.reservations});

        this.animateAway();
    }

    animateAway() {
        let definitions = new Array<AnimationDefinition>();
        let a1: AnimationDefinition = {
            target: <View>this.page.getViewById<View>("reservationForm"),
            scale: { x: 1, y: 0 },
            translate: { x: 0, y: -200 },
            opacity: 0,
            duration: 500,
            curve: enums.AnimationCurve.easeIn
        };
        definitions.push(a1);

        let animationSet = new Animation(definitions);

        animationSet.play().then(() => {
            this.animateInto();
        })
        .catch((e) => {
            console.log(e.message);
        });
    }

    animateInto()
    {
        let definitions = new Array<AnimationDefinition>();
        let a1: AnimationDefinition = {
            target: <View>this.page.getViewById<View>("reservationResults"),
            scale: { x: 1, y: 1 },
            translate: { x: 0, y: -200 },
            opacity: 1,
            duration: 500,
            curve: enums.AnimationCurve.easeIn
        };
        definitions.push(a1);

        let animationSet = new Animation(definitions);
        this.showResults = true;
        animationSet.play().then(() => {
        
        })
        .catch((e) => {
            console.log(e.message);
        });
    }
}