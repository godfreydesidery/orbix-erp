import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FastMovingItemsComponent } from './fast-moving-items.component';

describe('FastMovingItemsComponent', () => {
  let component: FastMovingItemsComponent;
  let fixture: ComponentFixture<FastMovingItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FastMovingItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FastMovingItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
