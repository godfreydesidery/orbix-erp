import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialToMaterialComponent } from './material-to-material.component';

describe('MaterialToMaterialComponent', () => {
  let component: MaterialToMaterialComponent;
  let fixture: ComponentFixture<MaterialToMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialToMaterialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialToMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
