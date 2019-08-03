import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { AudioService } from '../service/audio.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.less']
})
export class PaginationComponent implements OnInit, AfterViewInit {

  // tslint:disable-next-line:no-input-rename
  @Input('items') listOfItems;
  // tslint:disable-next-line:no-input-rename
  @Input('size') lengthOfList: number;



  currentList = [];
  itemList = [];
  currentSetIn;

  constructor(private audioService: AudioService) { }

  ngOnInit() {
    setTimeout(() => {
      console.log(this.listOfItems);
      console.log(this.lengthOfList);
    }, 1100);
    console.log(this.listOfItems);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.paginate(this.lengthOfList);
      this.itemList = this.listOfItems.slice(0, 10);
      this.currentSetIn = '1 - ' + this.itemList.length + ' of ' + this.listOfItems.length;
    }, 2200);
  }

  paginate(size) {
    console.log(size);

    if ( size < 10) {
      this.currentList.push(['Showing All ' + size]);
    } else if (size === 10) {
      this.currentList.push(['10']);
    } else if (size > 10 && size < 20) {
      this.currentList.push(['10', 'ALL']);
    } else if (size === 20) {
      this.currentList.push(['10', '20']);
    } else if (size > 20 && size < 30) {
      this.currentList.push(['10', '20', 'ALL']);
    } else if (size === 30) {
      this.currentList.push(['10', '20', '30']);
    } else if (size > 30 && size < 40) {
      this.currentList.push(['10', '20', '30', 'ALL']);
    } else if (size === 40) {
      this.currentList.push(['10', '20', '30', '40']);
    } else if (size > 40 && size < 50) {
      this.currentList.push(['10', '20', '30', '40', 'ALL']);
    } else if ( size === 50) {
      this.currentList.push(['10', '20', '30', '40', '50']);
    } else {
      this.currentList.push(['10', '20', '30', '40', '50', 'ALL']);
    }
    // console.log(this.currentList);

  }

  promote(item) {

    console.log(item);
    const role = sessionStorage.getItem('role');
    console.log(role);
    const details = {
        data: null,
        user: '',
        role: ''
    };
    if (role.toLowerCase() === 'ibo' || role.toLowerCase() === 'silver' || role.toLowerCase() === 'eagle') {

    } else {
      details.data = item;
      details.user = sessionStorage.getItem('email');
      details.role = role;
      this.audioService.audioPromotion(details).subscribe(file => {
        console.log(file);
        if (file) {
          alert('file promoted');
        } else {
          alert('Already promoted');
        }

      });
    }
  }

  showSetIn(e, set) {

    e.preventDefault();
    if ( set === '10') {
      // tslint:disable-next-line:radix
      this.itemList = this.listOfItems.slice(0, Number.parseInt(set));
      this.currentSetIn = '1 - ' + this.itemList.length + ' of ' + this.listOfItems.length;
    } else if (set === '20') {
      // tslint:disable-next-line:radix
      this.itemList = this.listOfItems.slice(0, Number.parseInt(set));
      this.currentSetIn = '1 - ' + this.itemList.length + ' of ' + this.listOfItems.length;
    } else if (set === '30') {
      // tslint:disable-next-line:radix
      this.itemList = this.listOfItems.slice(0, Number.parseInt(set));
      this.currentSetIn = '1 - ' + this.itemList.length + ' of ' + this.listOfItems.length;
    } else if (set === '40') {
      // tslint:disable-next-line:radix
      this.itemList = this.listOfItems.slice(0, Number.parseInt(set));
      this.currentSetIn = '1 - ' + this.itemList.length + ' of ' + this.listOfItems.length;
    } else if (set === '50') {
      // tslint:disable-next-line:radix
      this.itemList = this.listOfItems.slice(0, Number.parseInt(set));
      this.currentSetIn = '1 - ' + this.itemList.length + ' of ' + this.listOfItems.length;
    } else if (set === 'ALL') {
      // tslint:disable-next-line:radix
      this.itemList = this.listOfItems.slice(0);
      this.currentSetIn = '1 - ' + this.itemList.length + ' of ' + this.listOfItems.length;
    }
  }

}
