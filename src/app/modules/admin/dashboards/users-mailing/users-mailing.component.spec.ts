import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersMailingComponent } from './users-mailing.component';

describe('UsersMailingComponent', () => {
  let component: UsersMailingComponent;
  let fixture: ComponentFixture<UsersMailingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersMailingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersMailingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
