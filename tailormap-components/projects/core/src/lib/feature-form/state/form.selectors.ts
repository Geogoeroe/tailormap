import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FormState, formStateKey } from './form.state';
import { LayerUtils } from '../../shared/layer-utils/layer-utils.service';
import { Feature } from '../../shared/generated';

const selectFormState = createFeatureSelector<FormState>(formStateKey);

export const selectFeatures = createSelector(selectFormState, state => state.features);

export const selectCurrentFeature = createSelector(selectFormState, state => state.feature);

export const selectFeatureFormOpen = createSelector(selectFormState, state => state.formOpen);

export const selectFormAlreadyDirty = createSelector(selectFormState, state => state.alreadyDirty);

export const selectCloseAfterSaveFeatureForm = createSelector(selectFormState, state => state.closeAfterSave);

export const selectTreeOpen = createSelector(selectFormState, state => state.treeOpen);

export const selectFormConfigs = createSelector(selectFormState, state => state.formConfigs);

export const selectFormEditting = createSelector(selectFormState, state => state.editting);

export const selectFormConfigsLoaded = createSelector(selectFormState, state => state.formConfigsLoaded);

export const selectFormFeaturetypes = createSelector(selectFormConfigs,
    formConfigs => formConfigs ? Array.from(formConfigs.keys()) : []);

export const selectFormConfigForFeatureType = createSelector(
  selectFormConfigs,
  (formConfigs, featureType : string) => formConfigs.get(LayerUtils.sanitizeLayername(featureType)),
);

export const selectFormConfigForFeature = createSelector(
  selectFormConfigs,
  selectCurrentFeature,
  (formConfigs, feature: Feature) => {
    return feature ? formConfigs.get(LayerUtils.sanitizeLayername(feature.objecttype)) : null;
  },
);

export const selectFeatureLabel = createSelector(
  selectFormConfigs,
  (formConfigs, feature : Feature) : string => {
   return feature[formConfigs.get(LayerUtils.sanitizeLayername(feature.clazz))];
  },
);
