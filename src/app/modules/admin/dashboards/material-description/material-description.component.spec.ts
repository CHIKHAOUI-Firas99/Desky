import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDescriptionComponent } from './material-description.component';

describe('MaterialDescriptionComponent', () => {
  let component: MaterialDescriptionComponent;
  let fixture: ComponentFixture<MaterialDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialDescriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
