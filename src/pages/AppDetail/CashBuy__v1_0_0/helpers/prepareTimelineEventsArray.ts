import get from "lodash/get";

export function prepareTimelineEventsArray(app: object) {
  const now = {
    title: "Now",
    time: new Date().getTime(),
    color: "#60dafb",
  };

  const inspectPeriodStart = {
    title: "Inspection Begins",
    time: new Date(get(app, "val.glbl_inspect_start_date", 0) * 1000).getTime(),
    color: "rgba(0, 0, 0, 0.1)",
  };

  const inspectPeriodEnd = {
    title: "Inspection Ends",
    time: new Date(get(app, "val.glbl_inspect_end_date", 0) * 1000).getTime(),
    color: "rgba(0, 0, 0, 0.3)",
  };

  const inspectExtension = {
    title: "Inspection Extension",
    time: new Date(
      get(app, "val.glbl_inspect_extension_date", 0) * 1000
    ).getTime(),
    color: "rgba(0, 0, 0, 0.4)",
  };

  const movingDate = {
    title: "Moving Date",
    time: new Date(get(app, "val.glbl_moving_date", 0) * 1000).getTime(),
    color: "rgba(0, 0, 0, 0.5)",
  };

  const closingDate = {
    title: "Closing Date",
    time: new Date(get(app, "val.glbl_closing_date", 0) * 1000).getTime(),
    color: "rgba(0, 0, 0, 0.9)",
  };

  const freeFundsDate = {
    title: "Free Funds Date",
    time: new Date(get(app, "val.glbl_free_funds_date", 0) * 1000).getTime(),
    color: "rgba(0, 0, 0, 9.0)",
  };

  let timelineEvents = [
    now,
    inspectPeriodStart,
    inspectPeriodEnd,
    inspectExtension,
    movingDate,
    closingDate,
    freeFundsDate,
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
    inspectPeriodStart: inspectPeriodStart.time,
    inspectPeriodEnd: inspectPeriodEnd.time,
    inspectExtension: inspectExtension.time,
    closingDate: closingDate.time,
    movingDate: movingDate.time,
    freeFundsDate: freeFundsDate.time,
  };
}
