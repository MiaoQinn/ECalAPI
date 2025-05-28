class CalendarItem {
  public date: string;
  public time: string;
  public category: string;
  public source: string;
  public sourceURL: string;
  public actual: string;
  public previous: string;
  public importance: number;

  constructor(
    date: string,
    time: string,
    category: string,
    source: string,
    sourceURL: string,
    actual: string,
    previous: string,
    importance: number
  ) {
    this.date = date;
    this.time = time;
    this.category = category;
    this.source = source;
    this.sourceURL = sourceURL;
    this.actual = actual;
    this.previous = previous;
    this.importance = importance;
  }
}
