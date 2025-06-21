import axios from "axios";
import urls from "../utils/url.config.json";
import { parseStringPromise } from "xml2js";

import CalendarItem from "../models/calendarItem.model";

class TreasuryServices {
  /**
   *
   * @param start Start Date YYYY-MM-DD
   * @param end End Date YYYY-MM-DD
   * @param pageSize Optional: Number of records to fetch at a time
   * @returns
   */
  async getTreasuryDataByDate(
    start: string,
    end: string,
    pageSize: number = 100
  ) {
    let pageNumber: number = 1;
    let finalRes: CalendarItem[] = [];
    let totalPageNumber = 2;

    let latest = "1990-01-01";

    /**
     * Stored Schdule
     */
    while (pageNumber <= totalPageNumber) {
      const params = {
        "page[number]": pageNumber,
        "page[size]": pageSize,
        filter: `auction_date:gte:${start},auction_date:lte:${end}`,
      };

      try {
        const response: any = await axios.get(urls.Treasury.Historical, {
          params,
        });
        totalPageNumber = response.data.meta["total-pages"];
        response.data.data.forEach((element: any) => {
          latest =
            element.auction_date > latest ? element.auction_date : latest;

          // Create calendar item
          let past_calendarItem = new CalendarItem({
            date: element.auction_date,
            time: "11:30 AM",
            title:
              element.security_term +
              " Treasury " +
              element.security_type +
              " Auction",
            category: "Treasury",
            source: "TreasuryDirect",
            sourceURL: urls.Treasury.Historical_Source,
            importance: 1,
          });
          finalRes.push(past_calendarItem);
        });

        pageNumber++;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    console.debug("lates date:" + latest.toString());

    /**
     * Future Tentative Schdule
     */
    try {
      // axios takes forever to run, do not use it here for XML format data.
      const response = await fetch(urls.Treasury.Tentitive_Auction_Schedule);
      const xmlData = await response.text();

      const jsonData = await parseStringPromise(xmlData, {
        explicitArray: false,
        mergeAttrs: true,
      });

      jsonData.AuctionCalendar.AuctionCalendarDate.forEach((element: any) => {
        if (
          element.AuctionDate <= end &&
          (latest === "1990-01-01"
            ? element.AuctionDate >= start
            : element.AuctionDate > latest)
        ) {
          let calendarItem = new CalendarItem({
            date: element.AuctionDate,
            time: "11:30",
            title:
              element.SecurityTermWeekYear +
              " Treasury " +
              element.SecurityType +
              " Auction",
            category: "Treasury",
            source: "TreasuryDirect",
            sourceURL: urls.Treasury.Tentitive_Auction_Schedule,
            importance: 1,
          });
          finalRes.push(calendarItem);
        }
      });
    } catch (err) {
      console.error("Error getting tentative schdule for Treasury Data!", err);
    }

    return finalRes;
  }
}

export default new TreasuryServices();
