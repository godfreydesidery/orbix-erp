import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMassManagerComponent } from './product-mass-manager.component';

describe('ProductMassManagerComponent', () => {
  let component: ProductMassManagerComponent;
  let fixture: ComponentFixture<ProductMassManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductMassManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductMassManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
