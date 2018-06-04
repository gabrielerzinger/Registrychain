import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CEVComponent } from './cev.component';

describe('CEVComponent', () => {
  let component: CEVComponent;
  let fixture: ComponentFixture<CEVComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CEVComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CEVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
