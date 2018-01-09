import { Component } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Page } from 'ui/page';
import { TextField } from 'ui/text-field';

import { Comment } from '../shared/comment';
import { Dish } from '../shared/dish';

import { DishService } from '../services/dish.service';

@Component({
  moduleId: module.id,
  templateUrl: './comment.component.html'
})
export class CommentComponent {

  dish: Dish;
  commentForm: FormGroup;
  slider: number = 5;

  constructor(private params: ModalDialogParams,
    private page: Page,
    private dishservice: DishService,
    private formBuilder: FormBuilder) {
      this.commentForm = this.formBuilder.group({
        author: ['', Validators.required],
        rating: 5,
        comment: ['', Validators.required]
      });
  }

  onNameChange(args) {
    const textField = <TextField>args.object;
    this.commentForm.patchValue({author: textField.text});
  }

  onCommentChange(args) {
    const textField = <TextField>args.object;
    this.commentForm.patchValue({comment: textField.text});
  }

  public submitComment() {
    console.log("Submitting comment");
    const currentDate = new Date();
    this.commentForm.value.date = currentDate.toISOString();
    this.params.closeCallback(this.commentForm.value);
  }

}
