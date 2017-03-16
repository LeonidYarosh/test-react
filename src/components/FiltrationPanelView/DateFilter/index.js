import React, {Component, PropTypes} from 'react'
import moment from 'moment'
import DayPicker, {DateUtils} from 'react-day-picker'
import 'react-day-picker/lib/style.css'
import SwitchConditionFilter from '../Shared/SwitchConditionFilter'
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

function switchCoditionFilterDate(condition, dayItem) {
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

export function dateFilter(condition, items) {
  return items.filter(item => {
    const dayItem = formattingDate(item['Date Submitted'])
    return switchCoditionFilterDate(condition, dayItem)
  })
}

export default class DateBodyItemFilter extends Component {

  static propTypes = {
    condition: PropTypes.object.isRequired,
    onChangeFilter: PropTypes.func.isRequired,
    onApply: PropTypes.func.isRequired,
    resetFilteredItems: PropTypes.func.isRequired,
  }

  state = {
    showOverlay: false,
    showOverlayToFilter: false,
    selectedDay: null,
    isSelectingLastDay: false,
  }

  input = null
  inputToFilter = null
  daypicker = null
  clickedInside = false
  cleanClickInside = null

  componentWillUnmount() {
    clearTimeout(this.cleanClickInside())
  }

  updateCondition = (value, field) => {
    const {onChangeFilter, condition} = this.props
    const updatedCondition = update(condition, {
      value: {[field]: {$set: moment(value, 'L', true).isValid() ? formattingDate(value) : value}},
    })
    onChangeFilter(updatedCondition)
  }

  handleDayClickBetween = (day) => {
    const {isSelectingLastDay} = this.state
    const typeFilter = 'from'
    const from = moment(this.props.condition.value.from).toDate()
    if (!isSelectingLastDay) {
      this.updateCondition(day, typeFilter)
      this.setState({
        isSelectingLastDay: true,
        showOverlay: true,
      })
    }
    if (isSelectingLastDay && from && day < from) {
      this.updateCondition(day, typeFilter)
      this.setState({
        showOverlay: true,
      })
    }
    if (isSelectingLastDay && DateUtils.isSameDay(day, from)) {
      this.reset()
    }
    if (isSelectingLastDay) {
      this.setState({
        isSelectingLastDay: false,
        showOverlay: false,
      })
    }
  }

  onClickDay = (day) => {
    const {condition} = this.props
    if (condition.type === 'between') {
      this.handleDayClickBetween(day)
    }
    else {
      this.updateCondition(day, 'from')
      this.setState({
        showOverlay: false,
      })
    }
    this.input.blur()
  }

  handleDayMouseEnter = (day) => {
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

  onFocusInput = (e) => {
    e.target.name === 'from' ?
      this.setState({
        showOverlay: true,
      }) :
      this.setState({
        showOverlayToFilter: true,
      })
  }

  onBlurInput = (e) => {
    const showOverlay = this.clickedInside
    const showOverlayToFilter = this.clickedInside

    if (e.target.name === 'from') {
      this.setState({
        showOverlay,
      })
      if (showOverlay) {
        this.input.focus()
      }
    }
    else {
      this.setState({
        showOverlayToFilter,
      })
      if (showOverlayToFilter) {
        this.inputToFilter.focus()
      }
    }
  }

  onChangeInput = (e) => {
    const {condition} = this.props
    const {value, name} = e.target
    const momentDay = moment(value, 'L', true)
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

  onKeyDownInput = (e) => {
    const {condition} = this.props
    if (e.keyCode === 13 &&
      (condition.value.from !== '' || condition.value.to !== '')
    ) {
      this.props.onApply()
    }
  }

  onChangeConditionType = (item) => {
    const {condition} = this.props
    const updatedCondition = update(condition, {
      type: {$set: item},
    })
    this.props.onChangeFilter(updatedCondition)
  }

  reset = () => {
    const {condition} = this.props
    const newCondition = update(condition, {
      value: {
        from: {$set: ''},
        to: {$set: ''},
      },
    })
    this.props.resetFilteredItems()
    this.props.onChangeFilter(newCondition)
    this.setState({
      isSelectingLastDay: false,
    })
  }

  render() {
    const {
      condition,
    } = this.props
    const fromInput = condition.value.from
    const toInput = condition.value.to
    const from = moment(fromInput, 'L', true).isValid() ?
      moment(condition.value.from).toDate() : null
    const to = moment(toInput, 'L', true).isValid() ?
      moment(condition.value.to).toDate() : null
    const {
      showOverlay,
      showOverlayToFilter,
    } = this.state
    const activeConditionDate = condition.type
    const selectedDay = fromInput !== '' ? moment(fromInput, 'L', true).toDate() : null
    const betweenCondition = activeConditionDate === 'between'
    const selectedDays = betweenCondition ? [!to ? from : {from, to}] : day => DateUtils.isSameDay(selectedDay, day)

    return (
      <div onMouseDown={ this.handleContainerMouseDown }>
        <SwitchConditionFilter
          conditions={conditions}
          onChangeConditionType={this.onChangeConditionType}
          activeCondition={activeConditionDate}
        />
        <div className={cx('input-and-clear-filter')}>
          <input
            type="text"
            name="from"
            ref={ (el) => {
              this.input = el
            } }
            placeholder="DD/MM/YYYY"
            value={ fromInput }
            onChange={e => this.onChangeInput(e, 'from')}
            className={cx({'input-date-between': betweenCondition}, 'input-filter')}
            onFocus={ this.onFocusInput }
            onBlur={ betweenCondition ? undefined : this.onBlurInput }
            onKeyDown={this.onKeyDownInput}
          />
          <input
            type="text"
            name="to"
            ref={ (el) => {
              this.inputToFilter = el
            } }
            placeholder="DD/MM/YYYY"
            value={ toInput }
            onChange={e => this.onChangeInput(e, 'to') }
            onFocus={ this.onFocusInput }
            onBlur={ this.onBlurInput }
            className={cx({'hide-block': !betweenCondition}, 'input-date-between')}
            onKeyDown={this.onKeyDownInput}
          />
          <div
            className={cx(
              {'show-block': fromInput !== '' || toInput !== ''},
              {'delete-input-filter-between': betweenCondition},
              'delete-input-filter hide-block')
            }
            onClick={this.reset}>
            &#10006;
          </div>
        </div>
        { (showOverlay || showOverlayToFilter) &&
        <div className={cx('date-picker-filter')} >
          <div className={cx('calendar-box')} >
            <DayPicker
              className={cx('Range')}
              ref={ (el) => {
                this.daypicker = el
              } }
              initialMonth={ selectedDay || undefined }
              selectedDays={ selectedDays }
              disabledDays={ betweenCondition ? {before: from} : undefined}
              modifiers={ betweenCondition ?
              {
                start: from,
                end: to,
              } :
                undefined }
              onDayClick={ this.onClickDay }
              onDayMouseEnter={ betweenCondition ? this.handleDayMouseEnter : undefined }
            />
          </div>
        </div>
        }
      </div>
    )
  }
}
