import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noSpaces'
})
export class NoSpacesPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      return value.replace(/\s/g, '');
    }
    return null;
  }

}
