import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateParser, TranslateService } from '@ngx-translate/core';

@Injectable()
export class ErpPaginator extends MatPaginatorIntl {
  constructor(translateService: TranslateService, translateParser: TranslateParser) {
    super();
    translateService
      .get([
        'PAGINATOR.FIRST_PAGE',
        'PAGINATOR.PAGE_OF',
        'PAGINATOR.LATEST_PAGE',
        'PAGINATOR.NEXT_PAGE',
        'PAGINATOR.PREV_PAGE',
        'PAGINATOR.ELEMENTS_FOR_PAGE'
      ])
      .subscribe((traduzioni: { [key: string]: string }) => {
        this.firstPageLabel = traduzioni['PAGINATOR.FIRST_PAGE'];
        this.itemsPerPageLabel = traduzioni['PAGINATOR.ELEMENTS_FOR_PAGE'];
        this.lastPageLabel = traduzioni['PAGINATOR.LATEST_PAGE'];
        this.nextPageLabel = traduzioni['PAGINATOR.NEXT_PAGE'];
        this.previousPageLabel = traduzioni['PAGINATOR.PREV_PAGE'];
        const rangeLabelIntl = traduzioni['PAGINATOR.PAGE_OF'];

        this.getRangeLabel = (page: number, pageSize: number, length: number): string => {
          if (length === 0) {
            return (
              translateParser.interpolate(rangeLabelIntl, {
                n: 1,
                l: 1
              }) || ''
            );
          }
          const amountPages = Math.ceil(length / pageSize);
          return (
            translateParser.interpolate(rangeLabelIntl, {
              n: page + 1,
              l: amountPages
            }) || ''
          );
        };
        this.changes.next();
      });
  }
}
