import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplySalesReportComponent } from './supply-sales-report.component';

describe('SupplySalesReportComponent', () => {
  let component: SupplySalesReportComponent;
  let fixture: ComponentFixture<SupplySalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplySalesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplySalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
