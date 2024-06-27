import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { ToastrModule } from 'ngx-toastr';
import { DialogComponent } from './components/dialog/dialog.component';
import { GenericTableComponent } from './components/generic-table/generic-table.component';
import { PipeExecutor } from './pipes/pipe-executor.pipe';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { CheckVisibilityDirective } from './directives/check-visibility.directive';
import { DialogConfirmComponent } from './components/dialog-confirm/dialog-confirm.component';
import { HasRoleDirective } from 'src/app/base/authentication/directives/has-role.directive';
import { DialogClientInsertComponent } from './components/dialog-client-insert/dialog-client-insert.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FormsModule } from '@angular/forms';
import { DropdownButtonComponent } from './components/filter-dropdown/filter-dropdown.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

const entries: any[] = [
  HasRoleDirective,
  DialogComponent,
  PipeExecutor,
  GenericTableComponent,
  CheckVisibilityDirective,
  DialogConfirmComponent,
  DialogClientInsertComponent,
  DropdownButtonComponent,
  BreadcrumbComponent
];

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [entries],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-center',
      progressBar: true,
      progressAnimation: 'increasing'
    }),
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    NgxGraphModule,
    MatFormFieldModule,
    MatDividerModule,
    MatOptionModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatTableModule,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatRadioModule,
    MatCardModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatBadgeModule,
    MatListModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatTableModule,
    MatTabsModule,
    RouterModule,
    NgxUiLoaderModule,
  ],
  providers: [DecimalPipe],
  exports: [
    entries,
    TranslateModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSortModule,
    MatProgressBarModule,
    MatRadioModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatBadgeModule,
    MatListModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatBottomSheetModule,
    MatTooltipModule,
    MatTableModule,
    MatTabsModule,
    NgxUiLoaderModule
  ]
})
export class SharedModule {}
