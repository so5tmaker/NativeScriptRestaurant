import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { comment } from '../shared/comment';
import { Page } from 'ui/page';

@Component({
  moduleId: module.id,
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  commentForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private params: ModalDialogParams,
    private page: Page) {

      this.commentForm = this.formBuilder.group({
        rating: 5,
        comment: ['', Validators.required],
        author: ['', Validators.required]
    });
  }

  ngOnInit() { }

  submit() {
    console.log(JSON.stringify(this.commentForm.value));
    this.params.closeCallback(this.commentForm.value);
  }
}
