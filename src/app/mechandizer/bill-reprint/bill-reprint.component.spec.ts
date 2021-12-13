import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillReprintComponent } from './bill-reprint.component';

describe('BillReprintComponent', () => {
  let component: BillReprintComponent;
  let fixture: ComponentFixture<BillReprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillReprintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillReprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
