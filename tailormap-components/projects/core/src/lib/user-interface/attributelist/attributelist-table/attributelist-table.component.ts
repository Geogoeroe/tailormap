import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import {
  MatSort,
  Sort,
} from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import {
  MatDialog,
  MatDialogConfig,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  AttributelistTable,
  AttributelistRefresh,
  RowClickData,
  RowData,
} from '../attributelist-common/attributelist-models';
import { AttributeDataSource } from '../attributelist-common/attributelist-datasource';
import { AttributelistFilter } from '../attributelist-common/attributelist-filter';
import { AttributelistTableOptionsFormComponent } from '../attributelist-table-options-form/attributelist-table-options-form.component';
import { AttributelistService } from '../attributelist.service';
import { AttributelistStatistic } from '../attributelist-common/attributelist-statistic';
import { AttributeService } from '../../../shared/attribute-service/attribute.service';
import { CheckState } from '../attributelist-common/attributelist-enums';
import { FormconfigRepositoryService } from '../../../shared/formconfig-repository/formconfig-repository.service';
import { LayerService } from '../layer.service';
import { StatisticTypeInMenu } from '../attributelist-common/attributelist-statistic-models';
import { StatisticService } from '../../../shared/statistic-service/statistic.service';
import { StatisticType } from '../../../shared/statistic-service/statistic-models';
import { ValueService } from '../../../shared/value-service/value.service';
import { TailorMapService } from '../../../../../../bridge/src/tailor-map.service';
import { HighlightService } from '../../../shared/highlight-service/highlight.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { AttributelistColumn } from '../attributelist-common/attributelist-column-models';
import {
  AttributelistNode,
  TreeDialogData,
} from '../attributelist-tree/attributelist-tree/attributelist-tree-models';
import { AttributelistTreeComponent } from '../attributelist-tree/attributelist-tree/attributelist-tree.component';
import {
  Subject,
} from 'rxjs';
import {
  concatMap,
  takeUntil,
} from 'rxjs/operators';
import { fromArray } from 'rxjs/internal/observable/fromArray';
import {
  AttributeListFeature,
  Relation,
} from '../../../shared/attribute-service/attribute-models';
// import { LiteralMapKey } from '@angular/compiler';

@Component({
  selector: 'tailormap-attributelist-table',
  templateUrl: './attributelist-table.component.html',
  styleUrls: ['./attributelist-table.component.css'],
  animations: [
    trigger('onDetailsExpand', [
      state('void', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('*', style({height: '*', visibility: 'visible'})),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AttributelistTableComponent implements AttributelistTable, AttributelistRefresh, OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatPaginator) private paginator: MatPaginator;
  @ViewChild(MatSort) private sort: MatSort;

  // Table reference for 'manually' rendering.
  @ViewChild('table') public table: MatTable<any>;

  @ViewChild(MatMenuTrigger)
  private statisticsMenu: MatMenuTrigger;

  @Output()
  public pageChange = new EventEmitter();

  @Output()
  public rowClick = new EventEmitter<RowClickData>();

  @Output()
  public tabChange = new EventEmitter();

  public dataSource = new AttributeDataSource(this.layerService,
                                              this.attributeService,
                                              this.formconfigRepoService);

  public checkedRows: AttributeListFeature[] = [];
  public treeData = new Array<AttributelistNode>();

  private filterMap = new Map<number, AttributelistFilter>();

  public filter = new AttributelistFilter(
    this.dataSource,
    this.valueService,
    this.dialog,
  );

  public statistic = new AttributelistStatistic(
    this.statisticsService,
    this.dataSource,
    );

  // Number of checked rows.
  public nrChecked = 0;

  // State of checked rows ('All','None','Some').
  public checkState = CheckState.None;

  private tabIndex = -1;

  /**
   * Declare enums to use in template
   */
  public eStatisticType = StatisticType;
  public eStatisticTypeInMenu = StatisticTypeInMenu;

  public keys = Object.keys;

  public values = Object.values;

  public contextMenuPosition = { x: '0px', y: '0px' };

  private destroyed = new Subject();

  constructor(private attributeService: AttributeService,
              private layerService: LayerService,
              private statisticsService: StatisticService,
              private tailorMapService: TailorMapService,
              private valueService: ValueService,
              public attributelistService: AttributelistService,
              private formconfigRepoService: FormconfigRepositoryService,
              private highlightService: HighlightService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog) {
    // console.log('=============================');
    // console.log('#Table - constructor');
  }

  public ngOnInit(): void {
    this.attributelistService.selectedTreeData$.pipe(takeUntil(this.destroyed)).subscribe(selectedTreeData => {
      if (!selectedTreeData.isChild) {
        this.dataSource.params.featureTypeId = -1;
        this.dataSource.params.featureTypeName = '';
        this.dataSource.params.featureFilter = '';
        this.dataSource.params.valueFilter = '';
      } else {
        this.dataSource.params.featureTypeId = selectedTreeData.params.featureType;
        this.dataSource.params.featureFilter = selectedTreeData.params.filter;
        this.dataSource.params.featureTypeName = selectedTreeData.name;
      }
      this.dataSource.loadTableData(this, selectedTreeData);
      this.attributelistService.updateTreeData(this.treeData);
    });
  }

  public ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  public ngAfterViewInit(): void {
    // console.log('#Table - ngAfterViewInit');

    // Set datasource paginator.
    this.dataSource.paginator = this.paginator;
    // Set datasource sort.
    this.dataSource.sorter = this.sort;

    // Prevent ExpressionChangedAfterItHasBeenCheckedErrors using setTimeout
    // maybe loadData and paginator settings in ngOnInit would be better
    setTimeout(() => {
      // console.log('#Table - ngAfterViewInit - paginator settings');

      // Hide the paginator pagesize combo.
      this.paginator.hidePageSize = true;

      // Init the paginator with the startup page index.
      this.paginator.pageIndex = 0;
    }, 0)
  }

  public onAfterLoadData(): void {
    // console.log('#Table - onAfterLoadData');

    // Update paginator total number of rows (needed!)
    this.paginator.length = this.dataSource.totalNrOfRows;

    // Update the table rows.
    this.table.renderRows();

    this.filterMap.get(this.dataSource.params.featureTypeId).initFiltering(this.getColumnNames());

    this.statistic.initStatistics(this.getColumnNames());

    // FOR TESTING. SHOW TABLE OPTIONS FORM AT STARTUP.
    // this.onTableOptionsClick(null);
  }

  public getActiveColumns(includeSpecial: boolean): AttributelistColumn[] {
    return this.dataSource.columnController.getActiveColumns(includeSpecial);
  }

  /**
   * Return the column names. Include special column names.
   */
  public getColumnNames(): string[] {
    const colNames = this.dataSource.columnController.getVisibleColumnNames(true);
    // console.log(colNames);
    return colNames;
  }

  /**
   * Returns numeric when statistic functions like min, max, average are possible
   */
  public getStatisticFunctionColumnType(name: string): string {
    return this.statistic.getStatisticFunctionColumnType(name);
  }

  public getColumnWidth(name: string): string {
    console.log('#Table - getColumnWidth - ' + name);
    return '180px';
  }

  /**
   * Returns if the bar with the button should be visible.
   */
  public getFooterBarVisible(): string {
    if (this.nrChecked === 0) {
      return 'none';
    } else {
      return 'block';
    }
  }

  /**
   * Fired when the checkbox in the header is clicked.
   */
  public onHeaderCheckClick(): void {
    const currCheckState = this.checkState;
    if (currCheckState === CheckState.All) {
      this.dataSource.checkNone();
    } else {
      this.dataSource.checkAll();
    }
    // Update check info.
    this.updateCheckedInfo();
  }

  public onObjectOptionsClick(): void {
    this.treeData = [];
    const filterForFeatureTypes = new Map<number, string>(); // moet deze niet globaal zijn?
    let filter = '';
    const relatedFeatures = [];
    this.checkedRows.forEach((row) => {
      const related = row.related_featuretypes;
      related.forEach((relate) => {
        if (filterForFeatureTypes.has(relate.id)) {
          filter = filterForFeatureTypes.get(relate.id);
          filterForFeatureTypes.set(relate.id, filter += ' OR ' + relate.filter ); // moet dit geen AND zijn?
        } else {
          filterForFeatureTypes.set(relate.id, relate.filter);
          relatedFeatures.push(relate);
        }
      });
    });

    const layer = this.layerService.getLayerByTabIndex(this.tabIndex);
    if (layer.name === '') {
      return;
    }
    // Set params layer name and id.
    this.dataSource.params.layerName = layer.name;
    this.dataSource.params.layerId = layer.id;
    this.treeData.push({
      name: layer.name,
      numberOfFeatures: this.nrChecked,
      features: this.checkedRows, // ToDo deze types komen niet overeen
      params: {
        application: this.layerService.getAppId(),
        appLayer: layer.id},
      isChild: false,
      columnNames: this.dataSource.columnController.getTest(),
      children: [],
    });
    fromArray(relatedFeatures).pipe(concatMap(feature => {
      this.dataSource.params.featureTypeId = feature.id;
      this.dataSource.params.featureTypeName = feature.foreignFeatureTypeName;
      this.dataSource.params.featureFilter = filterForFeatureTypes.get(feature.id);
      return this.dataSource.loadDataForAttributeTree();
    })).subscribe({
      next: (result) => {
        this.setTreeData(result);
      },
      complete: () => {
        this.dataSource.params.featureTypeId = -1;
        this.dataSource.params.featureTypeName = '';
        this.dataSource.params.featureFilter = '';
        this.openDialog();
      },
    })
  }

  public setTreeData(values: AttributelistNode) {
    this.treeData[0].children.push(values);
  }

  public openDialog() {
    const dialogData : TreeDialogData = {
      rowsChecked: this.nrChecked,
      tree: this.treeData,
    };
    const dialogRef = this.dialog.open(AttributelistTreeComponent, {
      width: '400px',
      data: dialogData,
      position: {
        right: '50px',
      },
      hasBackdrop: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.checkedRows = [];
    });
  }

  public onPageChange(event): void {
    // console.log('#Table - onPageChange');

    // Fire page change event.
    this.pageChange.emit();

    // Clear highligthing.
    this.highlightService.clearHighlight();

    // Update the table.
    this.updateTable();
  }

  /**
   * Fired when a checkbox is clicked.
   */
  public onRowCheckClick(row: RowData): void {
    // console.log('#Table - onRowCheckClick');
    // console.log(row);
    // Toggle the checkbox in the checked row.
    this.dataSource.toggleChecked(row);
    // Update check info.
    this.checkedRows.push({
      features: row,
      related_featuretypes: row.related_featuretypes,
      __fid: row.__fid,
    });
    this.updateCheckedInfo();
  }

  /**
   * Fired when a expand/collapse icon/char is clicked.
   */
  public onRowExpandClick(row: RowData): void {
    // console.log('#Table - onRowExpandClick');
    // console.log(row);
    if (row.hasOwnProperty('_detailsRow')) {
      // Toggle the expanded/collapsed state of the row.
      row._detailsRow.toggle();
    }
  }

  /**
   * Fired when a row is clicked.
   */
  public onRowClick(row: RowData): void {
    // console.log('#Table - onRowClicked');
    // console.log(row);

    // OM TE TESTEN!!!
    // if (row.__fid.indexOf('.2')>=0) {
    //   row.__fid = '';
    // }

    // Get zoomto buffer size.
    const zoomToBuffer = this.attributelistService.config.zoomToBuffer;

    // Highlight and zoom to clicked feature.
    const appLayer = this.layerService.getLayerByTabIndex(this.tabIndex);
    this.highlightService.highlightFeature(row.__fid, appLayer.id, true, zoomToBuffer);
  }

  /**
   * Fired when a column header is clicked.
   */
  public onSortClick(sort: Sort): void {
    // Reset the paginator page index.
    this.paginator.pageIndex = 0;
    // Update the table.
    this.updateTable();
  }

  /**
   * Fired when a column filter is clicked.
   */
  public onFilterClick(columnName: string): void {
    if (this.dataSource.params.hasDetail()) {
      console.log('filter voor detail tab');
    }
    this.filterMap.get(this.dataSource.params.featureTypeId).setFilter(this, columnName);
    // this.filter.setFilter(this, columnName);
  }

  /**
   * After setting filter(s) refresh the table
   */
  public refreshTable(): void {
    this.paginator.pageIndex = 0;
    this.updateTable();
    this.setFilterInAppLayer();
    this.statistic.refreshStatistics(this.dataSource.params.layerId, this.dataSource.params.valueFilter);
  }

  private setFilterInAppLayer() {
    const viewerController = this.tailorMapService.getViewerController();
    const appLayer = viewerController.getAppLayerById(this.filterMap.get(this.dataSource.params.featureTypeId).layerFilterValues.layerId);
    const cql = this.filterMap.get(this.dataSource.params.featureTypeId).createFilter();
    viewerController.setFilterString(cql, appLayer, 'ngattributelist');
  }

  /**
   * Check if a filter is active on a column
   */
  public getIsFilterActive(columnName): boolean {
    const colObject = this.filterMap.get(this.dataSource.params.featureTypeId).layerFilterValues.columns.find(c => c.name === columnName);
    let result: boolean;
    if (colObject) {
      result = colObject.status;
    } else {
      result = false;
    }
    return result;
  }

  /**
   * Fired when a cell on footer row is clicked.
   */
  public onStatisticsMenu(event: MouseEvent, colName: string) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.statisticsMenu.menuData = { colName };
    this.statisticsMenu.menu.focusFirstItem('mouse');
    this.statisticsMenu.openMenu()
  }

  public onStatisticsMenuClick(colName: string, statisticType: StatisticType) {
    this.statistic.setStatistics(colName, statisticType, this.dataSource.params.layerId, this.dataSource.params.valueFilter);
  }

  public getStatisticTypeInMenu(colName: string): string {
    return this.statistic.getStatisticTypeInMenu(colName);
  }

  public getStatisticResult(colName: string): string {
    return this.statistic.getStatisticResult(colName);
  }

  public isStatisticsProcessing(colName: string): boolean {
    return this.statistic.isStatisticsProcessing(colName);
  }

  public onStatisticsHelp(): void {
    this.snackBar.open('Open contextmenu in de betreffende kolom voor statistiche functies', 'Sluiten', {
      duration: 5000,
    });
    return;
  }
  /**
   * Shows a popup to set visible columns.
   */
  public onTableOptionsClick(evt: MouseEvent): void {

    // Get the target for setting the dialog position.
    let target = null;
    if (evt !== null) {
      target = new ElementRef(evt.currentTarget);
    }

    // Create and set the dialog config.
    const config = new MatDialogConfig();

    // Show transparent backdrop, click outside dialog for closing.
    config.backdropClass = 'cdk-overlay-backdrop';

    // Possible additional settings:
    //     config.hasBackdrop = false;     // Don't show a gray mask.
    //     config.maxHeight = '100px';
    //     config.height = '300px';
    //     config.panelClass = 'attributelist-table-options-form';

    config.data = {
      trigger: target,
      columnController: this.dataSource.columnController,
    };
    const dialogRef = this.dialog.open(AttributelistTableOptionsFormComponent, config);
    dialogRef.afterClosed().subscribe(value => {
      // Collapse all rows.
      this.dataSource.resetExpanded();
    });
  }

  public onTest(): void {
    // console.log('#Table.onTest');
    // this.table.renderRows();

    // // Get passport field/column names.
    // console.log(this.formconfigRepoService.getAllFormConfigs());
    // const passportName = 'wegvakonderdeel';
    // this.formconfigRepoService.formConfigs$.subscribe(formConfigs => {
    //     const formConfig = formConfigs.config[passportName];
    //     console.log(formConfig);
    //   },
    //   ()=>{},
    //   ()=> {
    //     console.log('onTest - complete');
    // });
  }

  public setTabIndex(tabIndex: number): void {
    // console.log('#Table - setTabIndex');
    // Set corresponding tab index.
    this.tabIndex = tabIndex;
    // Get layer.
    const layer = this.layerService.getLayerByTabIndex(this.tabIndex);
    // console.log(layer);
    if (layer.name === '') {
      return;
    }
    // Set params layer name and id.
    this.dataSource.params.layerName = layer.name;
    this.dataSource.params.layerId = layer.id;
    // Update table.
    this.updateTable();
  }

  private updateCheckedInfo(): void {
    // Update the number checked.
    this.nrChecked = this.dataSource.getNrChecked();
    // Update the check state.
    this.checkState = this.dataSource.getCheckState(this.nrChecked);
  }

  private updateTable(): void {
    // (Re)load data. Fires the onAfterLoadData method.
    this.dataSource.loadData(this);
    // Update check info (number checked/check state).
    this.updateCheckedInfo();
  }

  public resetTable(): void {
    this.checkedRows = [];
    this.dataSource.params.valueFilter = '';
    this.setTabIndex(this.tabIndex);
  }

  public setFilterMap(featureType: number): void {
    this.filterMap.set(featureType,
      new AttributelistFilter(
        this.dataSource,
        this.valueService,
        this.dialog,
      ));
  }
}
