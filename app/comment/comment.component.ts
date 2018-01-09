import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TextField } from 'ui/text-field';
import { Switch } from 'ui/switch';
import { ModalDialogService, ModalDialogOptions, ModalDialogParams } from "nativescript-angular/modal-dialog";
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-comment',
    moduleId: module.id,
    templateUrl: './comment.component.html'
})
export class CommentComponent implements OnInit {

    commentmodal: FormGroup;

    constructor(private params: ModalDialogParams, 
        private formBuilder: FormBuilder,) {

        this.commentmodal = this.formBuilder.group({
            rating: 5,
            author: ['', Validators.required],
            comment: ['', Validators.required],
            date: new Date().toString()
          });

    }

    ngOnInit() {

    }

    onSubmit() {
        console.log(this.commentmodal.value);
        this.params.closeCallback(this.commentmodal.value);
    }

}