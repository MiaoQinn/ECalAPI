class CalendarItem {
  public date: string;
  public time: string;
  public title: string;
  public category: string;
  public source?: string;
  public sourceURL?: string;
  public actual?: string;
  public previous?: string;
  public importance?: number;

  constructor({
    date,
    time,
    title,
    category,
    source,
    sourceURL,
    actual,
    previous,
    importance,
  }: {
    date: string;
    time: string;
    title: string;
    category: string;
    source?: string;
    sourceURL?: string;
    actual?: string;
    previous?: string;
    importance?: number;
  }) {
    this.date = date;
    this.time = time;
    this.title = title;
    this.category = category;
    this.source = source;
    this.sourceURL = sourceURL;
    this.actual = actual;
    this.previous = previous;
    this.importance = importance;
  }
}

export default CalendarItem;
