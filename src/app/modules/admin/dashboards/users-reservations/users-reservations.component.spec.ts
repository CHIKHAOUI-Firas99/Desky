import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersReservationsComponent } from './users-reservations.component';

describe('UsersReservationsComponent', () => {
  let component: UsersReservationsComponent;
  let fixture: ComponentFixture<UsersReservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersReservationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
