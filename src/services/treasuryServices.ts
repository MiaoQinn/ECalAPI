import axios from "axios";
import urls from "../utils/url.config.json";
import { parseStringPromise } from "xml2js";

class TreasuryServices {
  async getTreasuryDataByDate(
    start: string,
    end: string,
    pageSize: number = 100
  ) {
    let pageNumber: number = 1;
    let res: any[] = [];
    // temp
    let futureRes: any[] = [];
    let totalPageNumber = 2;

    while (pageNumber <= totalPageNumber) {
      const params = {
        "page[number]": pageNumber,
        "page[size]": pageSize,
        filter: `record_date:gte:${start},record_date:lte:${end}`,
      };
      try {
        const response: any = await axios.get(urls.Treasury.Historical, {
          params,
        });
        // Set Total Page
        totalPageNumber = response.data.meta["total-pages"];
        res.push(...response.data.data);
        pageNumber++;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    // fetch future auctions from tentative schdule
    try {
      // axios takes forever to run, do not use it here for XML format data.
      const response = await fetch(urls.Treasury.Tentitive_Auction_Schedule);
      const xmlData = await response.text();

      const jsonData = await parseStringPromise(xmlData, {
        explicitArray: false,
        mergeAttrs: true,
      });
      const startDate = jsonData.AuctionCalendar.StartDate;
      const endDate = jsonData.AuctionCalendar.EndDate;
      const todayDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

      if (end > todayDate) {
        jsonData.AuctionCalendar.AuctionCalendarDate.forEach((element: any) => {
          if (
            element.AnnouncementDate <= end &&
            element.AnnouncementDate > todayDate
          ) {
            futureRes.push(element);
          }
        });

        //debug
        console.log(futureRes.length);
      }

      // debug goes here
      //console.log(jsonData.AuctionCalendar.AuctionCalendarDate);
    } catch (err) {
      console.error("Error getting tentative schdule for Treasury Data!", err);
    }
    return res;
  }
}

// export service
export default new TreasuryServices();
