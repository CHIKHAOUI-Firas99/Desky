import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandResponseComponent } from './demand-response.component';

describe('DemandResponseComponent', () => {
  let component: DemandResponseComponent;
  let fixture: ComponentFixture<DemandResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandResponseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
