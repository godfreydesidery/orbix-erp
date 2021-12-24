import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupLevel2Component } from './group-level2.component';

describe('GroupLevel2Component', () => {
  let component: GroupLevel2Component;
  let fixture: ComponentFixture<GroupLevel2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupLevel2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupLevel2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
