import { createAction, props } from '@ngrx/store';
import { Feature } from '../../shared/generated';
import { Attribute, FormConfiguration } from '../form/form-models';


const formActionsPrefix = '[Form]';

export let setTreeOpen = createAction(
  `${formActionsPrefix} Open form tree`,
  props<{ treeOpen : boolean }>(),
);

export const setOpenFeatureForm = createAction(
  `${formActionsPrefix} Open feature form`,
  props<{ features : Feature[], closeAfterSave ?: boolean, alreadyDirty?: boolean }>(),
);

export const setSaveFeatures = createAction(
  `${formActionsPrefix} Save features`,
  props<{ features : Feature[] }>(),
);

export const setCloseFeatureForm = createAction(
  `${formActionsPrefix} Close feature form`,
);

export const setFeature = createAction(
  `${formActionsPrefix} Set feature`,
  props<{ feature : Feature }>(),
);

export const setFormConfigs = createAction(
  `${formActionsPrefix} Set formconfigurations`,
  props<{ formConfigs : FormConfiguration[] }>(),
);

export const setFormConfigsOptions = createAction(
  `${formActionsPrefix} Set options in formconfigurations`,
  props<{ fields : Map<string,  Attribute[]> }>(),
);


export const setOptionsDisables = createAction(
  `${formActionsPrefix} Set options disabled`,
  props<{ fields : Map<string,  Attribute[]> }>(),
);

export const setDisable = createAction(
  `${formActionsPrefix} Set option disabled`,
);
