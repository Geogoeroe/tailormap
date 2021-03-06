import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { AttributeListTableComponent } from './attribute-list-table.component';
import { attributeListStateKey, initialAttributeListState } from '../state/attribute-list.state';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { getStatisticServiceMockProvider } from '../../../shared/statistic-service/mocks/statistic.service.mock';
import { SharedModule } from '../../../shared/shared.module';

describe('AttributeListTableComponent', () => {

  let spectator: Spectator<AttributeListTableComponent>;
  const initialState = { [attributeListStateKey]: initialAttributeListState };
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: AttributeListTableComponent,
    imports: [ SharedModule ],
    providers: [
      provideMockStore({ initialState }),
      getStatisticServiceMockProvider(),
    ]
  });

  beforeEach(() => {
    spectator = createComponent();
    store = spectator.inject(MockStore);
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
