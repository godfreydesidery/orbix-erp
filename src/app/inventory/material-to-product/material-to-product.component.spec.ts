import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialToProductComponent } from './material-to-product.component';

describe('MaterialToProductComponent', () => {
  let component: MaterialToProductComponent;
  let fixture: ComponentFixture<MaterialToProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialToProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialToProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
