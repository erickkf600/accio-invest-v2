import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimentsComponent } from './moviments.component';

describe('MovimentsComponent', () => {
  let component: MovimentsComponent;
  let fixture: ComponentFixture<MovimentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovimentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MovimentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
