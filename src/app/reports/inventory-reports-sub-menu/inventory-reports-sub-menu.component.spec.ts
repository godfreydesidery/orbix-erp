import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryReportsSubMenuComponent } from './inventory-reports-sub-menu.component';

describe('InventoryReportsSubMenuComponent', () => {
  let component: InventoryReportsSubMenuComponent;
  let fixture: ComponentFixture<InventoryReportsSubMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryReportsSubMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryReportsSubMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
