import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReportsSubMenuComponent } from './sales-reports-sub-menu.component';

describe('SalesReportsSubMenuComponent', () => {
  let component: SalesReportsSubMenuComponent;
  let fixture: ComponentFixture<SalesReportsSubMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesReportsSubMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesReportsSubMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
