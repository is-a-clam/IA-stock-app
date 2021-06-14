class TimeRange {
  static ONE_MIN    = new TimeRange('1 min',   false, true)
  static TWO_MIN    = new TimeRange('2 mins',  false, true)
  static FIVE_MIN   = new TimeRange('5 mins',  false, true)
  static THIRTY_MIN = new TimeRange('30 mins', false, true)
  static ONE_HOUR   = new TimeRange('1H',      false, true)
  static FOUR_HOUR  = new TimeRange('4H',      false, true)
  static ONE_DAY    = new TimeRange('1D',      true,  true)
  static FIVE_DAY   = new TimeRange('5D',      true,  false)
  static ONE_WEEK   = new TimeRange('1W',      false, true)
  static ONE_MONTH  = new TimeRange('1M',      true,  true)
  static SIX_MONTH  = new TimeRange('6M',      true,  false)
  static ONE_YEAR   = new TimeRange('1Y',      true,  true)
  static FIVE_YEAR  = new TimeRange('5Y',      true,  false)

  constructor(short, range, increment) {
    this.short = short
    this.range = range
    this.increment = increment
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
