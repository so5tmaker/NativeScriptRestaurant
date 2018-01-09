import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup} from '@angular/forms';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { Page } from 'ui/page';

@Component({
    moduleId: module.id,
    templateUrl: './comment.component.html'
})
export class CommentModalComponent implements OnInit {

  comment: FormGroup;

  constructor(
    private params: ModalDialogParams,
    private formBuilder: FormBuilder,
    private page: Page) {
      this.comment = this.formBuilder.group({
        rating: 3,
        author: ['', Validators.required],
        comment: ['', Validators.required]
      });
  }

  ngOnInit() {

  }

  public onSubmit() {
    this.params.closeCallback(this.comment.value);
  }
}