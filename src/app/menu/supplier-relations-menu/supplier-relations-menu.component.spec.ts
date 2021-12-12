import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierRelationsMenuComponent } from './supplier-relations-menu.component';

describe('SupplierRelationsMenuComponent', () => {
  let component: SupplierRelationsMenuComponent;
  let fixture: ComponentFixture<SupplierRelationsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierRelationsMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierRelationsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
