import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CEVModalComponent } from './cev-modal.component';

describe('CEVModalComponent', () => {
  let component: CEVModalComponent;
  let fixture: ComponentFixture<CEVModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CEVModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CEVModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
