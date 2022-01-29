import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListingReportComponent } from './product-listing-report.component';

describe('ProductListingReportComponent', () => {
  let component: ProductListingReportComponent;
  let fixture: ComponentFixture<ProductListingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductListingReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
