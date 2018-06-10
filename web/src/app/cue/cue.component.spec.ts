import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUEComponent } from './cue.component';

describe('CUEComponent', () => {
  let component: CUEComponent;
  let fixture: ComponentFixture<CUEComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CUEComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CUEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
