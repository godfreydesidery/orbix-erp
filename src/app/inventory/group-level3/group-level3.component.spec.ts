import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupLevel3Component } from './group-level3.component';

describe('GroupLevel3Component', () => {
  let component: GroupLevel3Component;
  let fixture: ComponentFixture<GroupLevel3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupLevel3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupLevel3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
