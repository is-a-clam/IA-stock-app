class TimeRange {
  static ONE_MIN    = new TimeRange('1 min',   '1 minute',   false, true)
  static TWO_MIN    = new TimeRange('2 mins',  '2 minutes',  false, true)
  static FIVE_MIN   = new TimeRange('5 mins',  '5 minutes',  false, true)
  static THIRTY_MIN = new TimeRange('30 mins', '30 minutes', false, true)
  static ONE_HOUR   = new TimeRange('1H',      '1 hour',     false, true)
  static FOUR_HOUR  = new TimeRange('4H',      '4 hours',    false, true)
  static ONE_DAY    = new TimeRange('1D',      '1 day',      true,  true)
  static FIVE_DAY   = new TimeRange('5D',      '5 days',     true,  false)
  static ONE_WEEK   = new TimeRange('1W',      '1 week',     false, true)
  static ONE_MONTH  = new TimeRange('1M',      '1 month',    true,  true)
  static SIX_MONTH  = new TimeRange('6M',      '6 months',   true,  false)
  static ONE_YEAR   = new TimeRange('1Y',      '1 year',     true,  true)
  static FIVE_YEAR  = new TimeRange('5Y',      '5 years',    true,  false)

  constructor(short, long, range, increment) {
    this.short = short
    this.long = long
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
