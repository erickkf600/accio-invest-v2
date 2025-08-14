import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimentsListComponent } from './moviments-list.component';

describe('MovimentsListComponent', () => {
  let component: MovimentsListComponent;
  let fixture: ComponentFixture<MovimentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovimentsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MovimentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
