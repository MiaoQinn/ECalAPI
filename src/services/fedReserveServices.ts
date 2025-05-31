import { json } from "stream/consumers";
import urls from "../utils/url.config.json";
import CalendarItem from "../models/calendarItem.model";

class FedReserveServices {
  /**
   *
   * @param start
   * @param end
   */
  async getFedDataByDate(start: string, end: string) {
    const response = await fetch(urls.Federal_Reserve.FedCalendar);
    const jsonData = await response.json();
    const fedAnnouncement: any[] = jsonData.announcement;
    const fedEvents: any[] = jsonData.events;

    let finalRes: CalendarItem[] = [];

    fedAnnouncement.forEach((element) => {});

    fedEvents.forEach((element) => {
      if (element.days) {
        // same event on multiple dats of a month
        let daysArr: string[] = element.days
          .split(",")
          .map((s: string) => s.trim());
        daysArr.forEach((day) => {
          let formattedDate: string =
            element.month + "-" + day.padStart(2, "0");
          if (formattedDate <= end && formattedDate >= start) {
            let calendarItem = new CalendarItem({
              date: formattedDate,
              time: element.time,
              title: element.title,
              category: element.type
                ? "Federal Reserve " + element.type
                : "Federal Reserve",
              source: "Fedral Reserve URL",
              sourceURL: urls.Federal_Reserve.Federal_Reserve_Source,
              // need to change importance
              importance: 1,
            });

            finalRes.push(calendarItem);
          }
        });
      }
    });

    return finalRes;
  }

  /**
   *
   *
   *  Helper function
   * const arr: string[] = str.split(',').map(s => s.trim());
   */
}

export default new FedReserveServices();
