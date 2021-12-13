import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCreditNoteComponent } from './vendor-credit-note.component';

describe('VendorCreditNoteComponent', () => {
  let component: VendorCreditNoteComponent;
  let fixture: ComponentFixture<VendorCreditNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorCreditNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorCreditNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
