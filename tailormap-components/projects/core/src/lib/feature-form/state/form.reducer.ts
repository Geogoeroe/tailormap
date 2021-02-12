import { Action, createReducer, on } from '@ngrx/store';
import { FormState, initialFormState } from './form.state';
import * as FormActions from './form.actions';
import { FormConfiguration } from '../form/form-models';

const onCloseFeatureForm  = (state: FormState): FormState => ({
  ...state,
  features: [],
  feature: null,
  formOpen: false,
  treeOpen: false,
});

const onSetFeature = (state: FormState, payload : ReturnType<typeof FormActions.setFeature>): FormState => ({
  ...state,
  feature: payload.feature,
});

const onSaveFeature = (state: FormState, payload:  ReturnType<typeof FormActions.setSaveFeatures>) : FormState => ({
  ...state,
  features: payload.features,
});

const onSetOpenFeatureForm = (state: FormState, payload:  ReturnType<typeof FormActions.setOpenFeatureForm>): FormState => ({
  ...state,
  features: payload.features,
  formOpen: true,
  treeOpen: true,
  closeAfterSave: payload.closeAfterSave || false,
  alreadyDirty: payload.alreadyDirty || false,
});

const onSetTreeOpen = (state: FormState, payload :  ReturnType<typeof FormActions.setTreeOpen>): FormState => ({
  ...state,
  treeOpen: payload.treeOpen,
});

const onSetFormConfigs = (state: FormState, payload : ReturnType<typeof FormActions.setFormConfigs>): FormState => ({
  ...state,
  formConfigs: payload.formConfigs,
});

const setDisable = (state: FormState, payload : ReturnType<typeof FormActions.setDisable>): FormState => ({
  ...state,
  formConfigs:state.formConfigs.map((oldConfig, key) => {
      return {
        ...oldConfig,
        fields: oldConfig.fields.map(value => {
          let options = value.options;
          if(options){
            options = options.map(option =>{
              return {
                ...option,
                disabled: true
              }
            });
          }
          return {
            ...value,
            options
          }
        })
      };
  }),
});

const onSetFormConfigsOptions = (state: FormState, payload: ReturnType<typeof FormActions.setFormConfigsOptions>): FormState => ({
  ...state,
  formConfigs: state.formConfigs.map((oldConfig, key) => {
    if (payload.fields.has(oldConfig.featureType)) {
      const newFields = payload.fields.get(oldConfig.featureType);
      return {
        ...oldConfig,
        fields: oldConfig.fields.map(attr => {
          return newFields.find(field => field.key === attr.key) || attr;
        }),
      };
    } else {
      return oldConfig;
    }
  }),
});

const formReducerImpl = createReducer(
  initialFormState,
  on(FormActions.setDisable, setDisable),
  on(FormActions.setFormConfigsOptions, onSetFormConfigsOptions),
  on(FormActions.setFormConfigs, onSetFormConfigs),
  on(FormActions.setTreeOpen, onSetTreeOpen),
  on(FormActions.setSaveFeatures, onSaveFeature),
  on(FormActions.setFeature, onSetFeature),
  on(FormActions.setOpenFeatureForm, onSetOpenFeatureForm),
  on(FormActions.setCloseFeatureForm, onCloseFeatureForm),
);

export const formReducer = (state: FormState | undefined, action: Action) => {
  return formReducerImpl(state, action);
}
