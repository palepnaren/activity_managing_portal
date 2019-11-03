import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeYear'
})
export class DateModifyPipe implements PipeTransform {

  array: any;
  transform(value: any, args?: any): any {
    if(value != null){
      this.array = value.split('-');
      value = this.array[1]+'-'+this.array[2];
    }
    return value;
  }

}
