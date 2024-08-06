import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentTripComponent } from './recent-trip.component';

describe('RecentTripComponent', () => {
  let component: RecentTripComponent;
  let fixture: ComponentFixture<RecentTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentTripComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
