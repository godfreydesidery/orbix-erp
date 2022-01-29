import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZHistoryComponent } from './z-history.component';

describe('ZHistoryComponent', () => {
  let component: ZHistoryComponent;
  let fixture: ComponentFixture<ZHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
