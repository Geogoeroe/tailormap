import { AttributelistColumnController } from './attributelist-column-controller';

export interface AttributelistTable {
  onAfterLoadData: () => void;
}

export interface AttributelistForFilter {
  columnController: AttributelistColumnController;
  refreshTable: () => void;
}

export interface AttributelistConfig {
  pageSize: number;
  zoomToBuffer: number;
}

// Array of properties of type any.
export interface RowData {
  [property: string]: any;
}

export interface RowClickData {
  feature: RowData;
  layerId: number;
}