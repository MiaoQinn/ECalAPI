import * as cheerio from "cheerio";
import CalendarItem from "../models/calendarItem.model";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import e from "express";

class BLSServices {
  static finalRes: {
    BLS: {
      CPI: CalendarItem[];
      PPI: CalendarItem[];
      EmpSit: CalendarItem[];
      RealEarnings: CalendarItem[];
      StateJobs: CalendarItem[];
      StateEmp: CalendarItem[];
      ECI: CalendarItem[];
      JobLabor: CalendarItem[];
      Others: CalendarItem[];
    };
  } = {
    BLS: {
      CPI: [],
      PPI: [],
      EmpSit: [],
      RealEarnings: [],
      StateJobs: [],
      StateEmp: [],
      ECI: [],
      JobLabor: [],
      Others: [],
    },
  };
  constructor() {}

  static async getBLSDataByDate(start: string, end: string): Promise<Object> {
    const startprefix = start.slice(0, 4);
    const endprefix = end.slice(0, 4);

    const startyear = Number(startprefix);
    const endyear = Number(endprefix);

    for (let i = startyear; i <= endyear; i++) {
      const url = `https://www.bls.gov/schedule/${i}/home.htm`;

      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
      );
      await page.goto(url, { waitUntil: "domcontentloaded" });

      const html = await page.content();
      await browser.close();

      BLSServices.blsScrapeHelper(html, "odd", start, end);
      BLSServices.blsScrapeHelper(html, "even", start, end);
    }

    return BLSServices.finalRes;
  }

  /**
   *
   *  Utility Function For BLS Service
   */

  /**
   *
   * @param html
   * @param oddeven input odd or even to scrape the BLS schedule website.
   */
  static blsScrapeHelper(
    html: string,
    oddeven: string,
    start: string,
    end: string
  ) {
    const $ = cheerio.load(html);
    $(`.release-list-${oddeven}-row`).each((index, element) => {
      const dateText = $(element).find(".date-cell").find("p").text().trim();
      const timeText = $(element).find(".time-cell").find("p").text().trim();
      const title = $(element).find(".desc-cell").find("p").text().trim();

      if (
        this.dateFormatter(dateText) >= start &&
        this.dateFormatter(dateText) <= end
      ) {
        // CPI
        if (title.includes("Consumer Price Index")) {
          this.finalRes.BLS.CPI.push(
            new CalendarItem({
              date: this.dateFormatter(dateText),
              time: timeText,
              title: title,
              category: "BLS",
            })
          );
        }
        // PPI
        else if (title.includes("Producer Price Index")) {
          this.finalRes.BLS.PPI.push(
            new CalendarItem({
              date: this.dateFormatter(dateText),
              time: timeText,
              title: title,
              category: "BLS",
            })
          );
        }
        //EmpSit
        else if (title.includes("Employment Situation")) {
          this.finalRes.BLS.EmpSit.push(
            new CalendarItem({
              date: this.dateFormatter(dateText),
              time: timeText,
              title: title,
              category: "BLS",
            })
          );
        }
        // Real Earnings
        else if (title.includes("Real Earnings")) {
          this.finalRes.BLS.RealEarnings.push(
            new CalendarItem({
              date: this.dateFormatter(dateText),
              time: timeText,
              title: title,
              category: "BLS",
            })
          );
        }
        // State Job Openings and Labor Turnover
        else if (title.includes("State Job")) {
          this.finalRes.BLS.StateJobs.push(
            new CalendarItem({
              date: this.dateFormatter(dateText),
              time: timeText,
              title: title,
              category: "BLS",
            })
          );
        }
        // State Employment and Unemployment
        else if (title.includes("State Employment")) {
          this.finalRes.BLS.StateEmp.push(
            new CalendarItem({
              date: this.dateFormatter(dateText),
              time: timeText,
              title: title,
              category: "BLS",
            })
          );
        }
        // ECI
        else if (title.includes("Employment Cost Index")) {
          this.finalRes.BLS.ECI.push(
            new CalendarItem({
              date: this.dateFormatter(dateText),
              time: timeText,
              title: title,
              category: "BLS",
            })
          );
        }
        // Job Openings and Labor Turnover Survey
        else if (title.includes("Job Openings")) {
          this.finalRes.BLS.JobLabor.push(
            new CalendarItem({
              date: this.dateFormatter(dateText),
              time: timeText,
              title: title,
              category: "BLS",
            })
          );
        }
        // Others
        else {
          this.finalRes.BLS.Others.push(
            new CalendarItem({
              date: this.dateFormatter(dateText),
              time: timeText,
              title: title,
              category: "BLS",
            })
          );
        }
      }
    });
  }

  static dateFormatter(dateStr: string): string {
    const parsed = new Date(dateStr);

    if (isNaN(parsed.getTime())) {
      throw new Error(`Invalid date format: '${dateStr}'`);
    }

    const year = parsed.getFullYear();
    const month = (parsed.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
    const day = parsed.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
}

export default BLSServices;
