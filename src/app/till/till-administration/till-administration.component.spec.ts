import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TillAdministrationComponent } from './till-administration.component';

describe('TillAdministrationComponent', () => {
  let component: TillAdministrationComponent;
  let fixture: ComponentFixture<TillAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TillAdministrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TillAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
