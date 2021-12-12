import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionAttributesComponent } from './description-attributes.component';

describe('DescriptionAttributesComponent', () => {
  let component: DescriptionAttributesComponent;
  let fixture: ComponentFixture<DescriptionAttributesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescriptionAttributesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
