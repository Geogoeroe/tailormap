import { Injectable, OnDestroy } from '@angular/core';
import { Attribute, FormConfiguration, FormFieldType, SelectOption } from '../../form/form-models';
import { LinkedAttributeRegistryService } from '../registry/linked-attribute-registry.service';
import { AttributeControllerService, Attribuut } from '../../../shared/generated';
import { LayerUtils } from '../../../shared/layer-utils/layer-utils.service';
import { FormState } from '../../state/form.state';
import { Store } from '@ngrx/store';
import { selectFormConfigsMap } from '../../state/form.selectors';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import * as FormActions from '../../state/form.actions';

@Injectable({
  providedIn: 'root',
})
export class DomainRepositoryService implements OnDestroy {
  private formConfigs: Map<string, FormConfiguration>;
  private linkedAttributes: Array<Attribuut>;
  private destroyed = new Subject();

  constructor(
    private repo: AttributeControllerService,
    private store$: Store<FormState>,
    private registry: LinkedAttributeRegistryService) {
  }

  public ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  public initFormConfig(formConfigs: Map<string, FormConfiguration>) {

    this.formConfigs = formConfigs;
    const domainAttrs: Array<number> = [];
    formConfigs.forEach((config, key) => {
      config.fields.forEach(attribute => {
        if (attribute.type === FormFieldType.DOMAIN) {
          domainAttrs.push(attribute.linkedList);
        }
      });
    });
    if (domainAttrs.length > 0) {
      this.repo.attributes({ids: domainAttrs}).pipe(takeUntil(this.destroyed)).subscribe(result => {

        const tempList: Map<string, Attribute[]> = new Map<string, Attribute[]>();
        this.linkedAttributes = result;
        this.registry.setLinkedAttributes(this.linkedAttributes);
        for (const attribute of this.linkedAttributes) {
          const featureType = LayerUtils.sanitizeLayername(attribute.tabel_naam.toLowerCase());
          const fc: FormConfiguration = this.formConfigs.get(featureType);
          if (!fc) {
            continue;
          }
          let tempFields :  Attribute[] = [];
          fc.fields.forEach(field => {
            if (field.linkedList && field.linkedList === attribute.id) {
              const options: SelectOption[] = [];
              const domeinwaardes = attribute.domein.waardes;

              for (const domeinwaarde of domeinwaardes) {
                options.push({
                  label: domeinwaarde.synoniem || domeinwaarde.waarde,
                  val: domeinwaarde.id,
                  disabled: false,
                });
              }
              const tempfield = {
                ...field,
                options
              };
              tempFields.push(tempfield);
            }
          });
          if(tempList.has(featureType)){
            tempFields = tempFields.concat(tempList.get(featureType));
          }
          tempList.set(featureType, tempFields);
        }

        this.store$.dispatch(FormActions.setFormConfigsOptions ({fields: tempList}));
      });
    }
  }

}
