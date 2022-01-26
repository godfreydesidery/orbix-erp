import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtReceiptComponent } from './debt-receipt.component';

describe('DebtReceiptComponent', () => {
  let component: DebtReceiptComponent;
  let fixture: ComponentFixture<DebtReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebtReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebtReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
