import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTimesheetComponent } from './viewtimesheet.component';


describe('ViewTimesheetComponent', () => {
  let component: ViewTimesheetComponent;
  let fixture: ComponentFixture<ViewTimesheetComponent>;
  

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTimesheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});


