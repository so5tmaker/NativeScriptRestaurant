import { Component, OnInit, Inject, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';
import { RouterExtensions } from 'nativescript-angular/router';
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import { Toasty } from 'nativescript-toasty';
import { action } from 'ui/dialogs';

import 'rxjs/add/operator/switchMap';

import { Comment } from '../shared/comment';
import { Dish } from '../shared/dish';

import { CommentComponent } from '../comment/comment.component';

import { DishService } from '../services/dish.service';
import { FavoriteService } from '../services/favorite.service';

@Component({
  selector: 'app-dishdetail',
  moduleId: module.id,
  templateUrl: './dishdetail.component.html'
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  comment: Comment;
  errMsg: string;
  avgstars: string;
  numcomments: number;
  favorite: boolean = false;
  listHeight: number;

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private routerExtensions: RouterExtensions,
    private favoriteservice: FavoriteService,
    private fonticon: TNSFontIconService,
    private vcRef: ViewContainerRef,
    private modalService: ModalDialogService,
    @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.dishservice.getDish(+params['id']))
      .subscribe(dish => {
        this.dish = dish;
        this.favorite = this.favoriteservice.isFavorite(this.dish.id);
        this.processRatings();
        this.listHeight = this.numcomments * 100;
      },
      err => { this.dish = null; this.errMsg = <any>err; }
      );
  }

  processRatings() {
    this.numcomments = this.dish.comments.length;
    let total = 0;
    this.dish.comments.forEach(comment => total += comment.rating);
    this.avgstars = (total/this.numcomments).toFixed(2);
  }

  addToFavorites() {
    if (!this.favorite) {
      this.favorite = this.favoriteservice.addFavorite(this.dish.id);
      const toast = new Toasty(`Added Dish ${this.dish.id}`, "short", "bottom");
      toast.show();
    }
  }

  goBack(): void {
    this.routerExtensions.back();
  }

  openDishDetailDialog(): void {
    const options = {
      title: "Choose an Option",
      actions: [
        "Add to Favorites",
        "Add Comment"
      ],
      cancelButtonText: "Cancel"
    };
    action(options).then((result) => {
      console.log(result);
      if (result === "Add to Favorites") {
        console.log("Adding to favorites");
        this.addToFavorites();
      } else if (result === "Add Comment") {
        console.log("Opening comment form");
        this.createModalView();
      }
    });
  }

  createModalView() {
    const options: ModalDialogOptions = {
      viewContainerRef: this.vcRef,
      fullscreen: false
    };
    this.modalService.showModal(CommentComponent, options)
      .then((result: any) => {
        this.listHeight+= 100;
        this.dish.comments.push(result);
        this.processRatings();
      });
  }

}
