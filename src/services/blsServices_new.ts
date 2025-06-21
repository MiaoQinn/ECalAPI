import * as cheerio from "cheerio";
import CalendarItem from "../models/calendarItem.model";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

class BLSServices_New {
  constructor() {}

  static async getBLSDataByDate(
    start: string,
    end: string
  ): Promise<CalendarItem[]> {
    const url = "https://www.bls.gov/schedule/2025/home.htm";

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

    const $ = cheerio.load(html);
    const res: CalendarItem[] = [];

    $(".release-list-even-row").each((index, element) => {
      const dateText = $(element).find(".date-cell").find("p").text().trim();
      const timeText = $(element).find(".time-cell").find("p").text().trim();
      const title = $(element).find(".desc-cell").find("p").text().trim();

      res.push(
        new CalendarItem({
          date: dateText,
          time: timeText,
          title: title,
          category: "BLS",
        })
      );
    });

    return res;
  }
}

export default BLSServices_New;
