import { AttributeListConfig } from '../models/attribute-list.config';
import { AttributeListTabModel } from '../models/attribute-list-tab.model';

export const attributeListStateKey = 'attributelist';

export interface AttributeListState {
  visible: boolean;
  config: AttributeListConfig;
  tabs: AttributeListTabModel[];
  selectedTabLayerId: string;
}

export const initialAttributeListState: AttributeListState = {
  visible: false,
  config: {
    pageSize: 10,
    zoomToBuffer: 10,
  },
  tabs: [],
  selectedTabLayerId: null,
}
