import { Component, OnInit, Inject, ViewContainerRef } from '@angular/core';
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import { DishService } from '../services/dish.service';
import { FavoriteService } from '../services/favorite.service';
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import { ActivatedRoute, Params } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';
import { CommentModalComponent } from '../comment/comment.component';

import 'rxjs/add/operator/switchMap';
import { action } from 'ui/dialogs';

@Component({
  selector: 'app-dishdetail',
  moduleId: module.id,
  templateUrl: './dishdetail.component.html'
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  comment: Comment;
  errMess: string;
  avgstars: string;
  numcomments: number;
  favorite: boolean = false;

  constructor(
    private dishservice: DishService,
    private favoriteservice: FavoriteService,
    private fonticon: TNSFontIconService,
    private route: ActivatedRoute,
    private routerExtensions: RouterExtensions,
    private modalService: ModalDialogService, 
    private vcRef: ViewContainerRef,
    @Inject('BaseURL') private BaseURL) {

  }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.dishservice.getDish(+params['id']))
      .subscribe(
        dish => {
          this.dish = dish;
          this.favorite = this.favoriteservice.isFavorite(this.dish.id);
          this.numcomments = this.dish.comments.length;

          let total = 0;
          this.dish.comments.forEach(comment => total += comment.rating);
          this.avgstars = (total/this.numcomments).toFixed(2);
        },
        errmess => this.errMess = errmess
      );
  }

  addToFavorites() {
    if (!this.favorite) {
      this.favorite = this.favoriteservice.addFavorite(this.dish.id);
    }
  }

  goBack(): void {
    this.routerExtensions.back();
  }

  openActionDialog() {
    let options = {
      title: 'Actions',
      message: 'Choose right action',
      cancelButtonText: 'Cancel',
      actions: ['Add to Favorites', 'Add Comment']
    };

    action(options).then((result) => {
      if (result == 'Add to Favorites') {
        this.addToFavorites();
      } else if (result == 'Add Comment') {
        let options: ModalDialogOptions = {
          viewContainerRef: this.vcRef,
          fullscreen: false
        };

        this.modalService.showModal(CommentModalComponent, options)
          .then((result: any) => {
            if (result) {
              result.date = new Date().toISOString();
              this.dish.comments.push(result);
            }
          });
      }
    });
  }


}