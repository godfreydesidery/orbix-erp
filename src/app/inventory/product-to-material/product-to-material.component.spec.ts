import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductToMaterialComponent } from './product-to-material.component';

describe('ProductToMaterialComponent', () => {
  let component: ProductToMaterialComponent;
  let fixture: ComponentFixture<ProductToMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductToMaterialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductToMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
