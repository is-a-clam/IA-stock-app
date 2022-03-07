class TimeRange {
  static ONE_MIN = new TimeRange('1 min', false, true, 1, 'minute', 0)
  static TWO_MIN = new TimeRange('2 mins', false, true, 2, 'minute', 1)
  static FIVE_MIN = new TimeRange('5 mins', false, true, 5, 'minute', 2)
  static THIRTY_MIN = new TimeRange('30 mins', false, true, 30, 'minute', 3)
  static ONE_HOUR = new TimeRange('1H', false, true, 1, 'hour', 4)
  static FOUR_HOUR = new TimeRange('4H', false, true, 4, 'hour', 5)
  static ONE_DAY = new TimeRange('1D', true, true, 1, 'day', 6)
  static FIVE_DAY = new TimeRange('5D', true, false, 5, 'day', 7)
  static ONE_WEEK = new TimeRange('1W', false, true, 1, 'week', 8)
  static ONE_MONTH = new TimeRange('1M', true, true, 1, 'month', 9)
  static SIX_MONTH = new TimeRange('6M', true, false, 6, 'month', 10)
  static ONE_YEAR = new TimeRange('1Y', true, true, 1, 'year', 11)
  static FIVE_YEAR = new TimeRange('5Y', true, false, 5, 'year', 12)

  constructor(short, range, increment, number, unit, index) {
    this.short = short
    this.range = range
    this.increment = increment
    this.number = number
    this.unit = unit
    this.index = index
  }

  static fromString(short) {
    return Object.values(TimeRange).filter(timeRange => {
      return timeRange.short === short
    })[0]
  }

  static getIncrementFromRange(newRange, currIncrement) {
    var max, min
    switch (newRange.short) {
      case '1D':
        min = TimeRange.ONE_MIN
        max = TimeRange.THIRTY_MIN
        break
      case '5D':
        min = TimeRange.FIVE_MIN
        max = TimeRange.FOUR_HOUR
        break
      case '1M':
        min = TimeRange.FOUR_HOUR
        max = TimeRange.ONE_DAY
        break
      case '6M':
        min = TimeRange.ONE_DAY
        max = TimeRange.ONE_MONTH
        break
      case '1Y':
        min = TimeRange.ONE_WEEK
        max = TimeRange.ONE_MONTH
        break
      case '5Y':
        min = TimeRange.ONE_MONTH
        max = TimeRange.ONE_YEAR
        break
      default:
        break
    }

    if (currIncrement.index > max.index) {
      return max
    } else if (currIncrement.index < min.index) {
      return min
    } else {
      return currIncrement
    }
  }

  static getRangeFromIncrement(newIncrement, currRange) {
    var max, min
    switch (newIncrement.short) {
      case '1 min':
        min = TimeRange.ONE_DAY
        max = TimeRange.ONE_DAY
        break
      case '2 mins':
        min = TimeRange.ONE_DAY
        max = TimeRange.ONE_DAY
        break
      case '5 mins':
        min = TimeRange.ONE_DAY
        max = TimeRange.FIVE_DAY
        break
      case '30 mins':
        min = TimeRange.ONE_DAY
        max = TimeRange.FIVE_DAY
        break
      case '1H':
        min = TimeRange.FIVE_DAY
        max = TimeRange.FIVE_DAY
        break
      case '4H':
        min = TimeRange.FIVE_DAY
        max = TimeRange.ONE_MONTH
        break
      case '1D':
        min = TimeRange.ONE_MONTH
        max = TimeRange.SIX_MONTH
        break
      case '1W':
        min = TimeRange.SIX_MONTH
        max = TimeRange.ONE_YEAR
        break
      case '1M':
        min = TimeRange.SIX_MONTH
        max = TimeRange.FIVE_YEAR
        break
      case '1Y':
        min = TimeRange.FIVE_YEAR
        max = TimeRange.FIVE_YEAR
        break
      default:
        break
    }

    if (currRange.index > max.index) {
      return max
    } else if (currRange.index < min.index) {
      return min
    } else {
      return currRange
    }
  }

  static ranges() {
    return Object.values(TimeRange).filter(timeRange => {
      return timeRange.range
    })
  }

  static increments() {
    return Object.values(TimeRange).filter(timeRange => {
      return timeRange.increment
    })
  }
}

export default TimeRange
