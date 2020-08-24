import {Feature} from "../../shared/generated";

import {FormConfigurations} from "../form/form-models";

export interface DialogData {
  formFeatures: Feature[];
  formConfigs: FormConfigurations;
  isBulk: boolean;
  lookup: Map<string, string>;
}

export interface DialogClosedData {
  iets: string;
}