import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CCModalComponent } from './cc-modal.component';

describe('CCModalComponent', () => {
  let component: CCModalComponent;
  let fixture: ComponentFixture<CCModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CCModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CCModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
