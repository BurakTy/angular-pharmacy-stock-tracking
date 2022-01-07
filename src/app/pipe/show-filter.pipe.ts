import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showFilter',
  pure:false
})
export class ShowFilterPipe implements PipeTransform {

  transform(value: any[], filter: any): any {
    if(!value || !filter){
      return value;
    }
    let key=Object.keys(filter)[0];
    let aa=value.filter(item => console.log(item[key]===filter[key]))
    return aa;
  }

}
