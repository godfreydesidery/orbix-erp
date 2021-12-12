import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionReportsSubMenuComponent } from './production-reports-sub-menu.component';

describe('ProductionReportsSubMenuComponent', () => {
  let component: ProductionReportsSubMenuComponent;
  let fixture: ComponentFixture<ProductionReportsSubMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionReportsSubMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionReportsSubMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
