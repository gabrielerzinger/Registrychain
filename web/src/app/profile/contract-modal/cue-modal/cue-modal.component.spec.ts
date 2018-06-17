import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUEModalComponent } from './cue-modal.component';

describe('CUEModalComponent', () => {
  let component: CUEModalComponent;
  let fixture: ComponentFixture<CUEModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CUEModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CUEModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
