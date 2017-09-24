import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StakingsComponent } from './stakings.component';

describe('StakingsComponent', () => {
  let component: StakingsComponent;
  let fixture: ComponentFixture<StakingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StakingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
