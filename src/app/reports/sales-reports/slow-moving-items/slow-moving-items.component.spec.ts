import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlowMovingItemsComponent } from './slow-moving-items.component';

describe('SlowMovingItemsComponent', () => {
  let component: SlowMovingItemsComponent;
  let fixture: ComponentFixture<SlowMovingItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlowMovingItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlowMovingItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
