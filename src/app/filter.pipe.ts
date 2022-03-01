import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(items: any, term: string): any {
    if (!term || !items) return items;

    return FilterPipe.filter(items, term);
  }

  static filter(
    items: Array<{ [key: string]: any }>,
    term: string
  ): Array<{ [key: string]: any }> {
    const toCompare = term.toLowerCase();

    function checkInside(item: any, term: string) {
      if (
        typeof item === 'string' &&
        item.toString().toLowerCase().includes(toCompare)
      ) {
        return true;
      }

      for (let property in item) {
        if (!item[property]) {
          continue;
        }
        if (typeof item[property] === 'object') {
          if (checkInside(item[property], term)) {
            return true;
          }
        } else if (
          item[property].toString().toLowerCase().includes(toCompare)
        ) {
          return true;
        }
      }
      return false;
    }

    return items.filter(function (item) {
      return checkInside(item, term);
    });
  }
}
