import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TimeTableHeaderEmployeeComponent } from './time-table-header-employee.component';

describe('TimeTableHeaderEmployeeComponent', () => {
  let component: TimeTableHeaderEmployeeComponent;
  let fixture: ComponentFixture<TimeTableHeaderEmployeeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeTableHeaderEmployeeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TimeTableHeaderEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
