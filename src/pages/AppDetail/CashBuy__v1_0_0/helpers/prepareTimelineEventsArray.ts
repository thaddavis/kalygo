import get from "lodash/get";

export function prepareTimelineEventsArray(app: object) {
  const now = {
    title: "Now",
    time: new Date().getTime(),
    color: "purple",
  };

  const closingDate = {
    title: "Closing Date",
    time: new Date(get(app, "val.global_closing_date", 0) * 1000).getTime(),
    color: "green",
  };

  const inspectionPeriodEnd = {
    title: "Inspection Ends",
    time: new Date(
      get(app, "val.global_inspection_end_date", 0) * 1000
    ).getTime(),
    color: "orange",
  };

  let timelineEvents = [
    now,
    closingDate,
    inspectionPeriodEnd,
    {
      title: "Inspection Begins",
      time: new Date(
        get(app, "val.global_inspection_start_date", 0) * 1000
      ).getTime(),
      color: "red",
    },
    {
      title: "Free Funds Date",
      time: new Date(
        get(app, "val.global_free_funds_date", 0) * 1000
      ).getTime(),
      color: "pink",
    },
  ];

  function compare(a: any, b: any) {
    if (a.time < b.time) {
      return -1;
    }
    if (a.time > b.time) {
      return 1;
    }
    return 0;
  }

  timelineEvents.sort(compare);

  return {
    timeline: timelineEvents,
    now: now.time,
    inspectionPeriodEnd: inspectionPeriodEnd.time,
    closingDate: closingDate.time,
  };
}
