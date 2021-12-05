import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessContolComponent } from './access-contol.component';

describe('AccessContolComponent', () => {
  let component: AccessContolComponent;
  let fixture: ComponentFixture<AccessContolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessContolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessContolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
