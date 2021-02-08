import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FeatureNode, FormTreeMetadata } from './form-tree-models';
import { Feature } from '../../shared/generated';
import { FormTreeHelpers } from './form-tree-helpers';
import { Store } from '@ngrx/store';
import { FormState } from '../state/form.state';
import * as FormActions from '../state/form.actions';
import { selectFormConfigs } from '../state/form.selectors';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { TreeService } from '../../shared/tree/tree.service';
import { TreeModel } from '../../shared/tree/models/tree.model';
import { TransientTreeHelper } from '../../shared/tree/helpers/transient-tree.helper';

@Component({
  providers: [TreeService],
  selector: 'tailormap-form-tree',
  templateUrl: './form-tree.component.html',
  styleUrls: ['./form-tree.component.css'],
})
export class FormTreeComponent implements OnInit, OnChanges, OnDestroy {

  private destroyed = new Subject();

  @Input()
  public features : Feature[];

  @Input()
  public isCopy = false;

  private selectedFeature: Feature;

  @Input()
  public set feature (feature: Feature) {
    if (feature && this.transientTreeHelper) {
      this.transientTreeHelper.selectNode(feature.objectGuid);
    }
    this.selectedFeature = feature;
  }

  @Input()
  public featuresToCopy = [];

  @Input()
  public hasCheckboxes = false;

  @Input()
  public isBulk = false;
  private transientTreeHelper: TransientTreeHelper<FeatureNode>;

  constructor(
    private store$: Store<FormState>,
    private treeService: TreeService) {
    this.treeService.selectionStateChangedSource$.pipe(
      takeUntil(this.destroyed),
      map(nodeId => this.treeService.getNode(nodeId)),
      filter(node => !node.metadata.isFeatureType),
    ).subscribe(node => {
      this.store$.dispatch(FormActions.setFeature({feature: node.metadata.feature}));
    });
  }

  public ngOnInit() {
    this.transientTreeHelper = new TransientTreeHelper(
      this.treeService,
      true,
      node => {
        return !node.metadata.isFeatureType && this.selectedFeature.objectGuid === node.metadata.objectGuid;
      },
      this.hasCheckboxes,
    );
    if (this.features && this.features.length > 0) {
      this.createTree(this.features);
    }
  }

  public ngOnDestroy() {
    this.transientTreeHelper.destroy();
    this.destroyed.next();
    this.destroyed.complete();
  }

  public ngOnChanges(changes: SimpleChanges): void {
  }

  private createTree(features) {
    this.store$.select(selectFormConfigs).pipe(takeUntil(this.destroyed)).subscribe(formConfigs => {
      const tree : TreeModel<FormTreeMetadata> [] = FormTreeHelpers.convertFeatureToTreeModel(features, formConfigs);
      this.transientTreeHelper.createTree(tree);
    });
  }

  public closePanel() {
    this.store$.dispatch(FormActions.setTreeOpen({treeOpen: false}));
  }

  public isFeatureForCopyChecked(featureId: number): boolean {
    const isIn = false;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.featuresToCopy.length; i++) {
      if (featureId === this.featuresToCopy[i]) {
        return true;
      }
    }
    return isIn;
  }

  public addFeatureForCopy(event: any, featureId: number) {
    if (event.checked) {
      this.featuresToCopy.push(featureId);
    }
     else {
      for (let i = 0; i < this.featuresToCopy.length; i++) {
        if (featureId === this.featuresToCopy[i]) {
          this.featuresToCopy.splice(i, 1);
        }
      }
    }
  }

}
