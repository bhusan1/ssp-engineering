import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubNavigationsComponent } from './sub-navigations.component';

describe('SubNavigationsComponent', () => {
  let component: SubNavigationsComponent;
  let fixture: ComponentFixture<SubNavigationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubNavigationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubNavigationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
