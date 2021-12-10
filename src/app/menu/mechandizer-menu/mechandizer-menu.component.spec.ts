import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechandizerMenuComponent } from './mechandizer-menu.component';

describe('MechandizerMenuComponent', () => {
  let component: MechandizerMenuComponent;
  let fixture: ComponentFixture<MechandizerMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MechandizerMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MechandizerMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
