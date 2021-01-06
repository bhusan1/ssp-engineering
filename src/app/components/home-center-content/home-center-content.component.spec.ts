import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCenterContentComponent } from './home-center-content.component';

describe('HomeCenterContentComponent', () => {
  let component: HomeCenterContentComponent;
  let fixture: ComponentFixture<HomeCenterContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeCenterContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeCenterContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
