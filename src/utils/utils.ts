class Utils {
  constructor() {}

  public static parseDateString(input: string): Date | null {
    // Try ISO format: yyyy-MM-dd
    const isoFormat = /^\d{4}-\d{2}-\d{2}$/;
    if (isoFormat.test(input)) {
      const date = new Date(input);
      return isNaN(date.getTime()) ? null : date;
    }

    // Try US format: MM/dd/yyyy
    const usFormat = /^\d{2}\/\d{2}\/\d{4}$/;
    if (usFormat.test(input)) {
      const [month, day, year] = input.split("/").map(Number);
      const date = new Date(year, month - 1, day); // month is 0-based
      return isNaN(date.getTime()) ? null : date;
    }

    // Unsupported format
    return null;
  }

  public static compareDates(
    dateStr1: string,
    dateStr2: string
  ): number | null {
    const date1 = this.parseDateString(dateStr1);
    const date2 = this.parseDateString(dateStr2);

    if (!date1 || !date2) {
      console.error("Invalid date format encountered");
      return null;
    }

    // Compare timestamps directly
    if (date1.getTime() < date2.getTime()) return -1;
    if (date1.getTime() > date2.getTime()) return 1;
    return 0; // equal
  }
}

export default Utils;
