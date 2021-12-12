import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialMassManagerComponent } from './material-mass-manager.component';

describe('MaterialMassManagerComponent', () => {
  let component: MaterialMassManagerComponent;
  let fixture: ComponentFixture<MaterialMassManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialMassManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialMassManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
