import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesLedgeComponent } from './sales-ledge.component';

describe('SalesLedgeComponent', () => {
  let component: SalesLedgeComponent;
  let fixture: ComponentFixture<SalesLedgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesLedgeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesLedgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
