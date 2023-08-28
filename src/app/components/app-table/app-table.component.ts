import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  IterableDiffers,
  DoCheck,
  ChangeDetectionStrategy,
  IterableDiffer,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './app-table.component.html',
  styleUrls: ['./app-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppTableComponent implements OnInit, AfterViewInit, DoCheck {
  @Input() hasCounter = true;
  @Input() rows!: any[];
  @Input() fieldNames: string[];
  @Input() displayNames: string[];

  @Input() tableId = '';

  @Input() isEditable = true;
  @Input() editRoute: string;
  @Input() editOrDeleteIdFiledName: string;
  @Input() customEditEvent = false;

  @Input() isDeletable = false;
  @Input() customDeleteMessage: string;
  @Input() customDeleteErrorMessage: string;
  @Input() deleteBackendUrl: string;
  @Input() redirectRouteIdAfterDelete: string;

  @Input() iconListFields: any[] = [];
  @Input() topIconList: any;
  @Input() filterIconList: (row: any, icon: any) => boolean = () => true;
  @Input() chipFields: any[] = [];
  @Input() customFieldClasses: any = {};
  @Input() customFieldActions: { [key: string]: (value: string) => void } = {};
  @Input() userActions: string[] = [];

  @Input() isSelectable = false;
  @Input() selectActionIcon: string;
  @Output() selectActionEventEmitter = new EventEmitter();

  @Input() hasSearchBar = true;
  @Input() searchBarPlaceholder = 'Pesquisar';

  @Input() nameAndFunctionFields: string[] = [];
  @Input() toggleableFields: string[] = [];

  @Input() defaultSortColumn = '';

  @Output() toggleEventEmitter = new EventEmitter();
  @Output() editEventEmitter = new EventEmitter();
  @Output() deleteEventEmitter = new EventEmitter();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('appTable') appTable: MatTable<any>;

  dataSource: any;

  alert = alert;

  isReady = false;
  fieldNamesPlus: string[];

  allSelected = false;
  selection = new SelectionModel<any>(true, []);
  searchTerm = new Subject<string>();
  private differ: IterableDiffer<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private liveAnnouncer: LiveAnnouncer,
    private changeDetector: ChangeDetectorRef,
    private iterableDiffers: IterableDiffers,
  ) {
    this.rows = [];
    this.differ = iterableDiffers.find([]).create();
    this.rows = this.rows.map((row) => ({ ...row, isSelected: false }));

    this.searchTerm
      .pipe(debounceTime(50), distinctUntilChanged())
      .subscribe((value) => {
        this.doFilter(value);
      });
  }

  ngDoCheck() {
    const changes = this.differ.diff(this.rows);
    if (changes) {
      this.refreshTable();
    }
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.rows);

    this.fieldNamesPlus = [];
    this.fieldNamesPlus = [...this.fieldNames];
    if (this.isEditable) {
      this.fieldNamesPlus.push('edit');
    }
    if (this.isDeletable) {
      this.fieldNamesPlus.push('delete');
    }
    if (this.hasCounter) {
      this.fieldNamesPlus.unshift('counter');
    }
    if (this.isSelectable) {
      this.fieldNamesPlus.unshift('select');
    }
    this.isReady = true;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  navigateToId(id: string) {
    console.log({ id });
    this.router.navigate([this.editRoute, id]);
  }

  toggleEvent(_event: any, rowIndex: number) {
    this.toggleEventEmitter.emit({ rowIndex });
  }

  emitEditEvent(_event: any, rowIndex: number) {
    this.editEventEmitter.emit({ rowIndex });
  }

  emitDeleteEvent(_event: any, rowIndex: number) {
    this.deleteEventEmitter.emit({ rowIndex });
  }

  getIconListByName(fieldName: string) {
    return this.iconListFields.find((icon) => icon.name === fieldName);
  }

  getChipFieldByName(fieldName: string) {
    return this.chipFields.find(
      (chipField) => chipField.fieldName === fieldName,
    );
  }

  getSplittedNames(fieldValue: string): string[] {
    return fieldValue?.split(', ');
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.rows.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    return this.isAllSelected()
      ? this.selection.clear()
      : this.rows.forEach((row) => this.selection.select(row));
  }

  refreshTable() {
    // this.dataSource = new MatTableDataSource(this.rows);
    // console.log('refreshing table! your call to table shouldn\'t have dynamic method calls!');
    this.dataSource.data = this.rows;
    this.selection.clear();
    this.changeDetector.detectChanges();
  }
}
