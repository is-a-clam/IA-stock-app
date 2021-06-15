class TimeRange {
  static ONE_MIN    = new TimeRange('1 min',   false, true,  1,  "minute")
  static TWO_MIN    = new TimeRange('2 mins',  false, true,  2,  "minute")
  static FIVE_MIN   = new TimeRange('5 mins',  false, true,  5,  "minute")
  static THIRTY_MIN = new TimeRange('30 mins', false, true,  30, "minute")
  static ONE_HOUR   = new TimeRange('1H',      false, true,  1,  "hour")
  static FOUR_HOUR  = new TimeRange('4H',      false, true,  4,  "hour")
  static ONE_DAY    = new TimeRange('1D',      true,  true,  1,  "day")
  static FIVE_DAY   = new TimeRange('5D',      true,  false, 5,  "day")
  static ONE_WEEK   = new TimeRange('1W',      false, true,  1,  "week")
  static ONE_MONTH  = new TimeRange('1M',      true,  true,  1,  "month")
  static SIX_MONTH  = new TimeRange('6M',      true,  false, 6,  "month")
  static ONE_YEAR   = new TimeRange('1Y',      true,  true,  1,  "year")
  static FIVE_YEAR  = new TimeRange('5Y',      true,  false, 5,  "year")

  constructor(short, range, increment, number, unit) {
    this.short = short
    this.range = range
    this.increment = increment
    this.number = number
    this.unit = unit
  }
}

export default TimeRange

export function ranges() {
  return (
    Object.values(TimeRange).filter((timeRange) => {
      return timeRange.range
    })
  )
}

export function increments() {
  return (
    Object.values(TimeRange).filter((timeRange) => {
      return timeRange.increment
    })
  )
}
