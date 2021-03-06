import {
  createAction,
  props,
} from '@ngrx/store';
import { CreateLayerModeEnum } from '../models/create-layer-mode.enum';
import { AnalysisSourceModel } from '../models/analysis-source.model';
import { CriteriaTypeEnum } from '../models/criteria-type.enum';
import { CriteriaModel } from '../models/criteria.model';
import { UserLayerStyleModel } from '../models/user-layer-style.model';
import { PassportAttributeModel } from '../../application/models/passport-attribute.model';

const analysisActionsPrefix = '[Analysis]';

export const setCreateLayerMode = createAction(
  `${analysisActionsPrefix} Set Layer Creation Mode`,
  props<{ createLayerMode: CreateLayerModeEnum }>(),
);

export const clearCreateLayerMode = createAction(
  `${analysisActionsPrefix} Clear Layer Creation Mode`,
);

export const setLayerName = createAction(
  `${analysisActionsPrefix} Set Layer Name`,
  props<{ layerName: string }>(),
);

export const selectDataSource = createAction(
  `${analysisActionsPrefix} Select Data Source`,
  props<{ selectDataSource: boolean }>(),
);

export const setSelectedDataSource = createAction(
  `${analysisActionsPrefix} Set Selected Data Source`,
  props<{ source: AnalysisSourceModel }>(),
);

export const showCriteriaForm = createAction(
  `${analysisActionsPrefix} Show Criteria Form`,
  props<{ criteriaMode?: CriteriaTypeEnum }>(),
);

export const createCriteria = createAction(
  `${analysisActionsPrefix} Create Criteria`,
  props<{ criteria: CriteriaModel }>(),
);

export const removeCriteria = createAction(
  `${analysisActionsPrefix} Remove Criteria`,
);

export const setSelectedThematicAttribute = createAction(
  `${analysisActionsPrefix} Set Selected Attribute`,
  props<{ attribute: PassportAttributeModel }>(),
);

export const loadStyles = createAction(
  `${analysisActionsPrefix} Load Styles`,
);

export const loadStylesSuccess = createAction(
  `${analysisActionsPrefix} Styles Loaded`,
  props<{ styles: UserLayerStyleModel[] }>(),
);

export const loadStylesFailed = createAction(
  `${analysisActionsPrefix} Load Styles Failed`,
  props<{ error: string }>(),
);

export const setSelectedStyle = createAction(
  `${analysisActionsPrefix} Set Selected Style`,
  props<{ styleId: string }>(),
);

export const updateStyle = createAction(
  `${analysisActionsPrefix} Update Style`,
  props<{ style: UserLayerStyleModel }>(),
);

export const updateAllStyles = createAction(
  `${analysisActionsPrefix} Update All Style`,
  props<{ styleProp: keyof UserLayerStyleModel, value: number | string | boolean }>(),
);

export const setCreatingLayer = createAction(`${analysisActionsPrefix} Creating Layer`);

export const setCreatingLayerSuccess = createAction(
  `${analysisActionsPrefix} Creating Layer Success`,
  props<{ createdAppLayer: string }>(),
);

export const setCreatingLayerFailed = createAction(
  `${analysisActionsPrefix} Creating Layer Failed`,
  props<{ message: string }>(),
);

export const closeSidePanels = createAction(`${analysisActionsPrefix} Close Side Panels`);
