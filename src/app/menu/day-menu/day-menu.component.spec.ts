import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayMenuComponent } from './day-menu.component';

describe('DayMenuComponent', () => {
  let component: DayMenuComponent;
  let fixture: ComponentFixture<DayMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
