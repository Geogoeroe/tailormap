import { Injectable } from '@angular/core';
import { FormHelpers } from '../form/form-helpers';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Feature, FeatureControllerService } from '../../shared/generated';
import { forkJoin, Observable, of } from 'rxjs';
import { FeatureInitializerService } from '../../shared/feature-initializer/feature-initializer.service';
import { FormConfiguration } from '../form/form-models';


@Injectable({
  providedIn: 'root',
})
export class FormActionsService {

  constructor(
    private service: FeatureControllerService,
    private featureInitializerService: FeatureInitializerService,
    private _snackBar: MatSnackBar) {
  }

  public save$(isBulk: boolean, features: Feature[], parent: Feature): Observable<any> {

    if (isBulk) {
      const reqs : Observable<any>[] = [];
      features.forEach(feature => {
        const objectGuid = feature.objectGuid;
        reqs.push(this.service.update({objectGuid, body: feature}));
      });
      return forkJoin(reqs);
    } else {
      const feature = features[0];
      const objectGuid = feature.objectGuid;
      if (objectGuid && objectGuid !== FeatureInitializerService.STUB_OBJECT_GUID_NEW_OBJECT) {
        return this.service.update({objectGuid, body: feature});
      } else {
        const parentId = parent ? parent.objectGuid : null;
        return this.service.save({parentId, body: feature});
      }
    }
  }

  public removeFeature$(feature: Feature, features: Feature[]): Observable<any> {
    this.service.delete({featuretype: feature.clazz, objectGuid: feature.objectGuid}).subscribe(a => {
      console.log('removed: ', a);
    });

    const fs = this.removeFeatureFromArray(features, feature);

    console.error('to be implemented');
    return of({piet: 1, features: fs});
  }

  private removeFeatureFromArray(features: Feature[], feature: Feature): Feature[] {
    let fs = [];
    if (features) {
      fs = [...features.filter(f => f !== feature)];
      fs.forEach(f => {
        f.children = this.removeFeatureFromArray(f.children, feature);
      });
    }
    return fs;
  }

  public newItem$( features, type: string, formConfig: FormConfiguration): Observable<any> {
    const name = 'Nieuwe ' + formConfig.name;

    const parentFeature = features[0];
    // const relations = formConfig.relation.relation;
    const objecttype = FormHelpers.capitalize(type);

    const newFeature = this.featureInitializerService.create(objecttype, {
      id: null,
      clazz: type,
      isRelated: true,
      objecttype,
      children: null,
    });

    newFeature[formConfig.treeNodeColumn] = name;
    parentFeature.children.push(newFeature);
    const feature = newFeature;
    features = [...features];
    console.error('initform!@');
    return of({features, feature});
  }

}
