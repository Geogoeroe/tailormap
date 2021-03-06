import { Boom, Feature, Geometry, Wegvakonderdeel, Wegvakonderdeelplanning } from '../generated';
import { App, AppLayer, Map, MapComponent, VectorLayer, ViewerController } from '../../../../../bridge/typings';
import { Attribute } from '../attribute-service/attribute-models';
import { FormConfiguration, FormFieldType } from '../../feature-form/form/form-models';

export const mockAttribute = (overrides?: Partial<Attribute>): Attribute => ({
  allowValueListOnly: true,
  automaticValue: true,
  defaultValue: '',
  disableUserEdit: true,
  disallowNullValue: true,
  editAlias: '',
  editHeight: '',
  editable: true,
  featureType: 1,
  filterable: true,
  folder_label: '',
  id: 1,
  longname: '',
  name: '',
  selectable: true,
  type: '',
  valueList: '',
  visible: true,
  ...overrides,
});

export const mockFeature = (overrides?: Partial<Feature>): Feature => ({
  objecttype: '',
  clazz: 'test',
  children: [],
  objectGuid: '123-123',
  relatedFeatureTypes: [],
  ...overrides,
});

export const mockWegvakonderdeel = (overrides?: Partial<Wegvakonderdeel>): Wegvakonderdeel => ({
  ...mockFeature(),
  objecttype: 'Wegvakonderdeel',
  ...overrides,
});

export const mockWegvakonderdeelplanning = (overrides?: Partial<Wegvakonderdeelplanning>): Wegvakonderdeelplanning => ({
  ...mockFeature(),
  objecttype: 'Wegvakonderdeelplanning',
  ...overrides,
});

export const mockBoom = (overrides?: Partial<Boom>): Boom => ({
  ...mockFeature(),
  objecttype: 'Boom',
  geometrie: mockGeometry(),
  ...overrides,
});

export const mockGeometry = (overrides?: Partial<Geometry>): Geometry => ({
  bbox: [ 1, 2, 3, 4 ],
  coordinates: [ [{ x: 1, y: 2 }] ],
  crs: {
    properties: {},
    type: 'link',
  },
  ...overrides,
});

export const appMock = (overrides?: Partial<App>): App => ({
  appLayers: {},
  id: 1,
  levels: {},
  selectedContent: [],
  ...overrides,
});

export const mapMock = (overrides?: Partial<Map>): Map => ({
  addLayer: () => {},
  addListener: () => {},
  coordinateToPixel: () => ({ x: 1, y: 1 }),
  getLayer: () => null,
  getResolution: () => 1,
  update: () => {},
  zoomToExtent: () => {},
  zoomToResolution: () => {},
  ...overrides,
});

export const vectorLayerMock = (overrides?: Partial<VectorLayer>): VectorLayer => ({
  addFeatureFromWKT: () => {},
  addListener: () => {},
  drawFeature: () => {},
  getActiveFeature: () => null,
  id: '1',
  readGeoJSON: () => '',
  removeAllFeatures: () => {},
  removeListener: () => {},
  ...overrides,
});

export const mapComponentMock = (overrides?: Partial<MapComponent>): MapComponent => ({
  getMap: () => mapMock(),
  createVectorLayer: () => vectorLayerMock(),
  addListener: () => {},
  ...overrides,
});

export const appLayerMock = (overrides?: Partial<AppLayer>): AppLayer => ({
  id: '1',
  background: false,
  userlayer: false,
  alias: 'Layer 1',
  attribute: false,
  featureType: 1,
  layerName: 'layer1',
  layerId: 1,
  ...overrides,
});

export const viewerControllerMock = (overrides?: Partial<ViewerController>): ViewerController => ({
  app: appMock(),
  mapComponent: mapComponentMock(),
  addListener: () => {},
  addUserLayer: () => {},
  removeUserLayer: () => {},
  getAppLayer: () => appLayerMock(),
  getAppLayerById: () => appLayerMock(),
  getComponentsByClassNames: () => [],
  getService: () => null,
  getVisibleLayers: () => [],
  isDebug: () => true,
  registerSnappingLayer: () => {},
  setFilterString: () => {},
  ...overrides,
})

export const getVisibleLayerMocks = (visibleLayers: number[]) => {
  return ((castToStrings?: boolean): number[] | string[] =>
    typeof castToStrings === 'undefined' ? visibleLayers : visibleLayers.map(l => `${l}`)) as {
    (castToStrings?: false): number[];
    (castToStrings: true): string[];
  }
}

export const getFormConfigsMocks = () => {
  const configs = new Map<string, FormConfiguration>();
  const boomconfig : FormConfiguration = {
    tabConfig: undefined,
    fields: [
      {
        key: 'tak',
        column: 1,
        type: FormFieldType.TEXTFIELD,
        tab: 1,
      },
    ],
    featureType: 'Boom',
    name: 'Boomconfig',
    featuretypeMetadata: null,
    relation: null,
    tabs: 1,
    treeNodeColumn: 'test',
  };
  configs.set('boom', boomconfig);
  return configs;
}
