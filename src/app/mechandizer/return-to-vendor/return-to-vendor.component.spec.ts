import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnToVendorComponent } from './return-to-vendor.component';

describe('ReturnToVendorComponent', () => {
  let component: ReturnToVendorComponent;
  let fixture: ComponentFixture<ReturnToVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnToVendorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnToVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
