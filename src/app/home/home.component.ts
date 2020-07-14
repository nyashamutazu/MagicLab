import { Router } from '@angular/router';
import { ApiService } from './../core/services/api.service';
import { Component, OnInit, Output, Input, OnDestroy, EventEmitter } from '@angular/core';
import { Post } from '../core/model/post.model';
import { PageEvent } from '@angular/material/paginator';

import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(private apiService: ApiService, public dialog: MatDialog) {}

  isLoading = true;

  config = {
    count: 10
  };

  posts: Post[] = [];
  pageEvent: PageEvent;

  options: FormGroup;
  opSub: Subscription;

  errors = [];
  errorDialog = false;

  ngOnInit(): void {
    this.isLoading = true;

    this.options = new FormGroup({
      order: new FormControl(null, { validators: [Validators.required] }),
      direction: new FormControl(null, { validators: [Validators.required] }),
      timeStamp: new FormControl(null),
      id: new FormControl(null)
    });

    this.opSub = this.apiService.get(this.config).subscribe(
      result => {
        this.posts = result;
        this.isLoading = false;
      },
      err => {
        this.errorDialog = true;
        this.isLoading = false;
        console.log('Failed to get response');
      }
    );
  }

  search() {
    if (this.options.get('direction').value && this.options.get('id').value) {
      this.getIdOrder();
    } else if (
      this.options.get('order').value &&
      this.options.get('id').value
    ) {
      this.getIdDirection();
    } else if (
      this.options.get('direction').value &&
      this.options.get('timeStamp').value
    ) {
      this.getTimeStamp();
    } else if (
      this.options.get('order').value &&
      this.options.get('timeStamp').value
    ) {
      this.getTimeDirection();
    } else {
      this.errors.push('Please enter time stamp or id');
    }
  }

  onChangedPage(pageData: PageEvent) {
    this.config.count = pageData.pageSize;
    this.update(this.config);
  }

  getIdOrder() {
    console.log('Get Id Order');

    const id = this.options.get('id').value;

    const query = {
      count: this.config.count
    };

    if (this.options.get('direction').value === -1) {
      query['beforeId'] = id;
    } else {
      query['afterId'] = id;
    }

    this.update(query);
  }

  getIdDirection() {
    console.log('Get Id Direction');

    const id = this.options.get('id').value;

    const query = {
      count: this.config.count,
      id
    };

    if (this.options.get('order').value === 'desc') {
      query['direction'] = -1;
    } else {
      query['direction'] = 1;
    }

    this.update(query);
  }

  getTimeStamp() {
    console.log('Get Time Stamp');

    const timeStamp = this.options.get('timeStamp').value;

    const query = {
      count: this.config.count
    };

    if (this.options.get('direction').value === -1) {
      query['beforeTime'] = timeStamp;
    } else {
      query['afterTime'] = timeStamp;
    }

    this.update(query);
  }

  getTimeDirection() {
    console.log('Get Time Direction');

    const timeStamp = this.options.get('timeStamp').value;

    const query = {
      count: this.config.count,
      time: timeStamp
    };

    if (this.options.get('order').value === 'desc') {
      query['direction'] = -1;
    } else {
      query['direction'] = 1;
    }

    this.update(query);
  }

  update(query) {
    this.isLoading = true;

    this.apiService.get(query).subscribe(
      result => {
        this.isLoading = false;

        this.posts = result;
      },
      err => {
        this.closeDialog();
        console.log('Failed to get response');
      }
    );
  }

  closeDialog() {
    this.errorDialog = false;

    this.update(this.config);
  }

  ngOnDestroy(): void {
    this.opSub.unsubscribe();
  }
}

