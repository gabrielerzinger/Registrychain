import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { C2CModalComponent } from './c2-c-modal.component';

describe('C2CModalComponent', () => {
  let component: C2CModalComponent;
  let fixture: ComponentFixture<C2CModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ C2CModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(C2CModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
