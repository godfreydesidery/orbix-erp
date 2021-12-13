import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnelRegisterComponent } from './personnel-register.component';

describe('PersonnelRegisterComponent', () => {
  let component: PersonnelRegisterComponent;
  let fixture: ComponentFixture<PersonnelRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonnelRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonnelRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
