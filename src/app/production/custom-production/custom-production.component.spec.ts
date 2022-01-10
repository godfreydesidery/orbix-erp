import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomProductionComponent } from './custom-production.component';

describe('CustomProductionComponent', () => {
  let component: CustomProductionComponent;
  let fixture: ComponentFixture<CustomProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomProductionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
