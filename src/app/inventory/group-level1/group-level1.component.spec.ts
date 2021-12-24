import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupLevel1Component } from './group-level1.component';

describe('GroupLevel1Component', () => {
  let component: GroupLevel1Component;
  let fixture: ComponentFixture<GroupLevel1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupLevel1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupLevel1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
