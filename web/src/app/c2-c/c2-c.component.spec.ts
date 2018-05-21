import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { C2CComponent } from './c2-c.component';

describe('C2CComponent', () => {
  let component: C2CComponent;
  let fixture: ComponentFixture<C2CComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ C2CComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(C2CComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
