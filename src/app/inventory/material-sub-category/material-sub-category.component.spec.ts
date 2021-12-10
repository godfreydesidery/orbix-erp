import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialSubCategoryComponent } from './material-sub-category.component';

describe('MaterialSubCategoryComponent', () => {
  let component: MaterialSubCategoryComponent;
  let fixture: ComponentFixture<MaterialSubCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialSubCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
