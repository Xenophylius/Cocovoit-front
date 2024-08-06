import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripByIdComponent } from './trip-by-id.component';

describe('TripByIdComponent', () => {
  let component: TripByIdComponent;
  let fixture: ComponentFixture<TripByIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripByIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
