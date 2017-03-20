import React, {Component, PropTypes} from 'react'
import moment from 'moment'
import DayPicker, {DateUtils} from 'react-day-picker'
import 'react-day-picker/lib/style.css'
import SwitchFilterCondition from '../Shared/SwitchFilterCondition'
import cx from 'classnames'
import {formattingDate} from '../../../util/formatingDataContent'
import update from 'react-addons-update'
import '../Shared/InputFilter/style.sass'
import './style.sass'

export const conditions = [
  'equals',
  'before',
  'after',
  'between',
]

function filteringByCondition(condition, dayItem) {
  const from = condition.value.from
  const to = condition.value.to
  switch (condition.type) {
    case 'equals': {
      return dayItem === from
    }
    case 'before': {
      return moment(dayItem).isBefore(from)
    }
    case 'after': {
      return moment(dayItem).isAfter(from)
    }
    case 'between': {
      return moment(dayItem).isBetween(from, to)
    }
    default: {
      return dayItem === from
    }
  }
}

export function FiltrationFunction(condition, items) {
  return items.filter(item => {
    const dayItem = formattingDate(item['Date Submitted'])
    return filteringByCondition(condition, dayItem)
  })
}

export default class DateFilter extends Component {

  static propTypes = {
    condition: PropTypes.object.isRequired,
    onChangeFilter: PropTypes.func.isRequired,
    onApply: PropTypes.func.isRequired,
  }

  state = {
    showOverlayFromDate: false,
    showOverlayUpToDate: false,
    isSelectingLastDay: false,
  }

  constructor(props) {
    super(props)
    this.fromInputRef = null
    this.toInputRef = null
    this.daypicker = null
    this.clickedInside = false
    this.cleanClickInside = null
  }

  componentWillUnmount() {
    clearTimeout(this.cleanClickInside)
  }

  updateCondition = (value, field) => {
    const {onChangeFilter, condition} = this.props
    const updatedCondition = update(condition, {
      value: {[field]: {$set: moment(value, 'YYYY-MM-DD', true).isValid() ? formattingDate(value) : value}},
    })
    onChangeFilter(updatedCondition)
  }

  onClickDateBetween = (day) => {
    const {isSelectingLastDay} = this.state
    const typeFilter = 'from'
    const from = moment(this.props.condition.value.from).toDate()

    if (isSelectingLastDay) {
      if (from && day < from) {
        this.updateCondition(day, typeFilter)
        this.setState({
          showOverlayFromDate: true,
        })
      }
      else {
        if (DateUtils.isSameDay(day, from)) {
          this.reset()
        }

        this.setState({
          isSelectingLastDay: false,
          showOverlayFromDate: false,
        })
      }
    }
    else {
      this.updateCondition(day, typeFilter)
      this.setState({
        isSelectingLastDay: true,
        showOverlayFromDate: true,
      })
    }
  }

  onClickDay = (day) => {
    const {condition} = this.props
    if (condition.type === 'between') {
      this.onClickDateBetween(day)
    }
    else {
      this.updateCondition(day, 'from')
      this.setState({
        showOverlayFromDate: false,
      })
    }
    this.fromInputRef.blur()
  }

  onMouseEnterDateBetween = (day) => {
    const {isSelectingLastDay} = this.state
    const from = moment(this.props.condition.value.from).toDate()
    if (!isSelectingLastDay || from && day < from || DateUtils.isSameDay(day, from)) {
      return
    }
    this.updateCondition(day, 'to')
  }

  handleContainerMouseDown = () => {
    this.clickedInside = true
    this.cleanClickInside = setTimeout(() => {
      this.clickedInside = false
    }, 0)
  }

  onFocus = (e) => {
    e.target.name === 'from' ?
      this.setState({
        showOverlayFromDate: true,
      }) :
      this.setState({
        showOverlayUpToDate: true,
      })
  }

  onBlur = (e) => {
    const showOverlayFromDate = this.clickedInside
    const showOverlayUpToDate = this.clickedInside

    if (e.target.name === 'from') {
      this.setState({
        showOverlayFromDate,
      })
      if (showOverlayFromDate) {
        this.fromInputRef.focus()
      }
    }
    else {
      this.setState({
        showOverlayUpToDate,
      })
      if (showOverlayUpToDate) {
        this.toInputRef.focus()
      }
    }
  }

  onChange = (e) => {
    const {condition} = this.props
    const {value, name} = e.target
    const momentDay = moment(value, 'YYYY-MM-DD', true)
    if (value === '') {
      this.reset()
    }
    else {
      if (momentDay.isValid()) {
        if (condition.type === 'between' &&
          name === 'to' && moment(momentDay).isBefore(condition.value.from)) {
          /* eslint-disable */
          alert('Second date less first')
        }
        this.daypicker.showMonth(momentDay.toDate())
      }
      this.updateCondition(value, name)
    }
  }

  onKeyDown = (e) => {
    const {condition} = this.props
    if (e.keyCode === 13) {
      this.props.onApply()
    }
  }

  reset = () => {
    const {condition} = this.props
    const newCondition = update(condition, {
      value: {
        from: {$set: ''},
        to: {$set: ''},
      },
    })
    this.props.onChangeFilter(newCondition)
    this.setState({
      isSelectingLastDay: false,
    })
  }

  render() {
    const {
      condition,
      onChangeFilter,
    } = this.props

    const {
      showOverlayFromDate,
      showOverlayUpToDate,
    } = this.state

    const fromInput = condition.value.from
    const toInput = condition.value.to
    const from = moment(fromInput, 'YYYY-MM-DD', true).isValid() ?
      moment(condition.value.from).toDate() : null
    const to = moment(toInput, 'YYYY-MM-DD', true).isValid() ?
      moment(condition.value.to).toDate() : null

    const activeConditionDate = condition.type
    const isBetween = activeConditionDate === 'between'
    const selectedDays = isBetween ? [!to ? from : {from, to}] : day => DateUtils.isSameDay(from, day)

    return (
      <div onMouseDown={ this.handleContainerMouseDown }>
        <SwitchFilterCondition
          conditions={conditions}
          condition={condition}
          onChangeFilter={onChangeFilter}
          activeCondition={activeConditionDate}
        />
        <div className={cx('input-and-clear-filter')}>
          <input
            type="text"
            name="from"
            ref={ (el) => {
              this.fromInputRef = el
            } }
            placeholder='YYYY-MM-DD'
            value={ fromInput }
            onChange={e => this.onChange(e, 'from')}
            className={cx({'input-date-between': isBetween}, 'input-filter')}
            onFocus={ this.onFocus }
            onBlur={ isBetween ? undefined : this.onBlur }
            onKeyDown={this.onKeyDown}
          />
          <input
            type="text"
            name="to"
            ref={ (el) => {
              this.toInputRef = el
            } }
            placeholder='YYYY-MM-DD'
            value={ toInput }
            onChange={e => this.onChange(e, 'to') }
            onFocus={ this.onFocus }
            onBlur={ this.onBlur }
            className={cx({'hide-block': !isBetween}, 'input-date-between')}
            onKeyDown={this.onKeyDown}
          />
          <div
            className={cx(
              {'show-block': fromInput !== '' || toInput !== ''},
              {'delete-input-filter-between': isBetween},
              'delete-input-filter hide-block')
            }
            onClick={this.reset}>
            &#10006;
          </div>
        </div>
        { (showOverlayFromDate || showOverlayUpToDate) &&
        <div className={cx('date-picker-filter')}>
          <div className={cx('calendar-box')}>
            <DayPicker
              className={cx('Range')}
              ref={ (el) => {
                this.daypicker = el
              } }
              initialMonth={ from || undefined }
              selectedDays={ selectedDays }
              disabledDays={ isBetween ? {before: from} : undefined}
              modifiers={ isBetween ?
              {
                start: from,
                end: to,
              } :
              undefined }
              onDayClick={ this.onClickDay }
              onDayMouseEnter={ isBetween ? this.onMouseEnterDateBetween : undefined }
            />
          </div>
        </div>
        }
      </div>
    )
  }
}
