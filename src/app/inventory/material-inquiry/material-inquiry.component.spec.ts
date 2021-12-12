import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialInquiryComponent } from './material-inquiry.component';

describe('MaterialInquiryComponent', () => {
  let component: MaterialInquiryComponent;
  let fixture: ComponentFixture<MaterialInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialInquiryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
