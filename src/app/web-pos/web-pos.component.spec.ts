import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebPosComponent } from './web-pos.component';

describe('WebPosComponent', () => {
  let component: WebPosComponent;
  let fixture: ComponentFixture<WebPosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebPosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebPosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
