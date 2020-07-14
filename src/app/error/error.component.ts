import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  @Output() close = new EventEmitter<boolean>();

  navigate() {
    this.close.emit(true);
  }

  closeDialog() {

  }
}
