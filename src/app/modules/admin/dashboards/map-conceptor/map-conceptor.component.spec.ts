import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapConceptorComponent } from './map-conceptor.component';

describe('MapConceptorComponent', () => {
  let component: MapConceptorComponent;
  let fixture: ComponentFixture<MapConceptorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapConceptorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapConceptorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
