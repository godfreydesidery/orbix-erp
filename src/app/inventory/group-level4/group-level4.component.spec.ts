import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupLevel4Component } from './group-level4.component';

describe('GroupLevel4Component', () => {
  let component: GroupLevel4Component;
  let fixture: ComponentFixture<GroupLevel4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupLevel4Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupLevel4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
