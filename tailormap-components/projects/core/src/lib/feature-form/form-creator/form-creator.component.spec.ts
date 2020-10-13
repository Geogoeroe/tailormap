import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormCreatorComponent } from './form-creator.component';
import {
  Feature,
  FeatureControllerService,
  Wegvakonderdeel,
  Wegvakonderdeelplanning,
} from '../../shared/generated';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";
import { FormConfiguration} from "../form/form-models";
import {FormfieldComponent} from "../form-field/formfield.component";
import {FormComponent} from "../form/form.component";
import {FormPopupComponent} from "../form-popup/form-popup.component";
import {FormTreeComponent} from "../form-tree/form-tree.component";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {AddFeatureComponent} from "../../user-interface/add-feature/add-feature.component";
import {FeatureInitializerService} from "../../shared/feature-initializer/feature-initializer.service";
import { FormConfigMockModule } from '../../shared/formconfig-repository/formconfig-mock.module.spec';

describe('FormCreatorComponent', () => {
  let component: FormCreatorComponent;
  let fixture: ComponentFixture<FormCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        SharedModule,
        FormConfigMockModule,
      ],
      providers:[
        FeatureControllerService,

      ],
      declarations: [
        FormComponent,
        AddFeatureComponent,
        FormPopupComponent,
        FormTreeComponent,
        FormfieldComponent,
        FormCreatorComponent,]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCreatorComponent);
    component = fixture.componentInstance;
    let formConfig : FormConfiguration = {
      featureType: "",
      tabConfig: undefined,
      fields: [],
      tabs: 0,
      name: 'pietje',
      treeNodeColumn:'wer'
    };
    component.formConfig = formConfig;
    component.ngOnChanges();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update a childfeature in the features array', ()=>{
    let featureToBeChanged : Wegvakonderdeelplanning ={
      objecttype: "wegvakonderdeelplanning",
      objectGuid: "twee",
      maatregel_wvko: "bar"
    };

    let featureIsChanged : Wegvakonderdeelplanning ={
      objecttype: "wegvakonderdeelplanning",
      objectGuid: "twee",
      maatregel_wvko: "foo"
    };


    let featuresArray: Feature[];
    featuresArray = [
      {
        objectGuid: "een",
        objecttype: "wegvakonderdeel",
        children: [
         featureToBeChanged
        ]
      }
    ];
    let newArray = component.updateFeatureInArray(featureIsChanged, featuresArray);
    expect(newArray.length === 1).toBeTruthy();
    expect(newArray[0].objectGuid).toEqual('een');
    expect(newArray[0].children.length).toEqual(1);
    expect((newArray[0].children[0] as Wegvakonderdeelplanning).maatregel_wvko).toEqual(featureIsChanged.maatregel_wvko);
  });

  it('should update the parent feature in the features array', ()=>{
    let featureToBeChanged : Wegvakonderdeel ={
      objecttype: "wegvakonderdeel",
      objectGuid: "een",
      aanlegjaar: 15,
      children:[
        {
          objecttype: "wegvakonderdeelplanning",
          objectGuid: "twee",
          maatregel_wvko: "foo"
        } as Wegvakonderdeelplanning]
    };

    let featureIsChanged : Wegvakonderdeel ={
      objecttype: "wegvakonderdeel",
      objectGuid: "een",
      aanlegjaar: 16,
      children:[
        {
          objecttype: "wegvakonderdeelplanning",
          objectGuid: "twee",
          maatregel_wvko: "foo"
        } as Wegvakonderdeelplanning]
    };

    let featuresArray = [featureToBeChanged ];
    let newArray = component.updateFeatureInArray(featureIsChanged, featuresArray);
    expect(newArray.length === 1).toBeTruthy();
    expect(newArray[0].objectGuid).toEqual('een');
    expect(newArray[0].children.length).toEqual(1);
    expect((newArray[0] as Wegvakonderdeel).aanlegjaar).toEqual(featureIsChanged.aanlegjaar);
  });

  it('should update the objecttguid of a new feature in  features array', ()=>{

    let featureIsChanged : Wegvakonderdeel ={
      objecttype: "wegvakonderdeel",
      objectGuid: "een",
      aanlegjaar: 16,
      children:[]
    };
    let baseFeature: Wegvakonderdeel  = {
      objecttype: "wegvakonderdeel",
      objectGuid: FeatureInitializerService.STUB_OBJECT_GUID_NEW_OBJECT
    };
    let featuresArray = [baseFeature];
    let newArray = component.updateFeatureInArray(featureIsChanged, featuresArray);
    expect(newArray.length === 1).toBeTruthy();
    expect(newArray[0].objectGuid).toEqual('een');
    expect(newArray[0].children.length).toEqual(0);
    expect((newArray[0] as Wegvakonderdeel).aanlegjaar).toEqual(featureIsChanged.aanlegjaar);
  });
});