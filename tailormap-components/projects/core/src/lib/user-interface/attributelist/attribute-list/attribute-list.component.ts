import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AttributeListState } from '../state/attribute-list.state';
import { selectAttributeListVisible } from '../state/attribute-list.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'tailormap-attribute-list',
  templateUrl: './attribute-list.component.html',
  styleUrls: ['./attribute-list.component.css'],
})
export class AttributeListComponent implements OnInit {

  public isVisible$: Observable<boolean>;

  constructor(
    private store$: Store<AttributeListState>,
  ) {
    this.isVisible$ = this.store$.select(selectAttributeListVisible);
  }

  public ngOnInit(): void {
  }

}
