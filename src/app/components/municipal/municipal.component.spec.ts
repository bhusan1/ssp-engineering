import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MunicipalComponent } from './municipal.component';

describe('MunicipalComponent', () => {
  let component: MunicipalComponent;
  let fixture: ComponentFixture<MunicipalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MunicipalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MunicipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
