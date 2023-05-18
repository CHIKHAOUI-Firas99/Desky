import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaterialDemandComponent } from './add-material-demand.component';

describe('AddMaterialDemandComponent', () => {
  let component: AddMaterialDemandComponent;
  let fixture: ComponentFixture<AddMaterialDemandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMaterialDemandComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMaterialDemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
