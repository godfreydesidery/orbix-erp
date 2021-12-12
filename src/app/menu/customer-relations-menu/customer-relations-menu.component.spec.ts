import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerRelationsMenuComponent } from './customer-relations-menu.component';

describe('CustomerRelationsMenuComponent', () => {
  let component: CustomerRelationsMenuComponent;
  let fixture: ComponentFixture<CustomerRelationsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerRelationsMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerRelationsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
