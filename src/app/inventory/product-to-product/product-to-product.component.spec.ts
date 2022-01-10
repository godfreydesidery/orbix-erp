import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductToProductComponent } from './product-to-product.component';

describe('ProductToProductComponent', () => {
  let component: ProductToProductComponent;
  let fixture: ComponentFixture<ProductToProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductToProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductToProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
