import { DecimalPipe, formatDate } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipeExecutor'
})
export class PipeExecutor implements PipeTransform {
  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private decimalPipe: DecimalPipe
  ) {}

  transform(value: any, args?: any): any {
    if (!value) {
      if (typeof args === 'function') {
        return args();
      }
      return;
    }

    if (typeof args === 'function') {
      return args(value);
    }

    if (typeof value === 'number') {
      if (!args) {
        args = '.1-1';
      }
      return this.decimalPipe.transform(value, args);
    }

    if (value instanceof Date) {
      if (!args) {
        args = 'short';
      }
      return formatDate(value, args, 'it');
    }

    if (args && this.isDate(value)) {
      return formatDate(value, args, 'it');
    }

    return value;
  }

  isDate(value: string) {
    const d = new Date(value);
    return !isNaN(d.valueOf());
  }
}
