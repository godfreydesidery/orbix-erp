import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockCardReportComponent } from './stock-card-report.component';

describe('StockCardReportComponent', () => {
  let component: StockCardReportComponent;
  let fixture: ComponentFixture<StockCardReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockCardReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockCardReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
