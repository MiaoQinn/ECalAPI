class Utils {
  constructor() {}

  /**
   *
   * @param input
   * @returns Transform the input to ISO format yyyy-mm-dd
   */
  public static parseDateString(input: string): string {
    // Try ISO format: yyyy-MM-dd
    const isoFormat = /^\d{4}-\d{2}-\d{2}$/;
    if (isoFormat.test(input)) {
      return input;
    }

    // Try US format: MM/dd/yyyy
    const usFormat = /^\d{2}\/\d{2}\/\d{4}$/;
    if (usFormat.test(input)) {
      const [month, day, year] = input.split("/").map(Number);

      if (
        !month ||
        !day ||
        !year ||
        month < 1 ||
        month > 12 ||
        day < 1 ||
        day > 31 ||
        year < 1000 ||
        year > 9999
      ) {
        throw new Error(`Invalid date format: '${input}'`);
      }

      // Format to YYYY-MM-DD
      const iso = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
      return iso;
    }

    // Unsupported format
    return "null";
  }

  //   public static compareDates(
  //     dateStr1: string,
  //     dateStr2: string
  //   ): number | null {
  //     const date1 = this.parseDateString(dateStr1);
  //     const date2 = this.parseDateString(dateStr2);

  //     if (!date1 || !date2) {
  //       console.error("Invalid date format encountered");
  //       return null;
  //     }

  //     // Compare timestamps directly
  //     if (date1.getTime() < date2.getTime()) return -1;
  //     if (date1.getTime() > date2.getTime()) return 1;
  //     return 0; // equal
  //   }
}

export default Utils;
