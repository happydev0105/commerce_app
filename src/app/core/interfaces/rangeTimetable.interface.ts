export interface IRangeTimeTable {
  start: ScheduleHour;
  end: ScheduleHour;
  rest?: {
    start: ScheduleHour;
    end: ScheduleHour;
  };
}

export interface ScheduleHour {
  hour: number | null;
  minute: number | null;
}
