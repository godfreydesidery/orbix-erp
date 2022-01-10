import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMaterialRatioComponent } from './product-material-ratio.component';

describe('ProductMaterialRatioComponent', () => {
  let component: ProductMaterialRatioComponent;
  let fixture: ComponentFixture<ProductMaterialRatioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductMaterialRatioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductMaterialRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
