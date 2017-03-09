import React, {Component, PropTypes} from 'react'
import moment from 'moment'
import DayPicker, {DateUtils} from 'react-day-picker'
import 'react-day-picker/lib/style.css'
import SwitchConditionFilterDate from './SwitchConditionFilterDate'
import cx from 'classnames'
import {formattingDate} from '../../util/formatingDataContent'
import update from 'react-addons-update'

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
    conditions: PropTypes.array.isRequired,
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


  changeConditionValueFromOrTo = (value, field) => {
    const {condition} = this.props
    return update(condition, {
      value: {[field]: {$set: moment(value, 'L', true).isValid() ? formattingDate(value) : value}},
    })
  }

  handleBetweenInputChange = (e, typeFilter) => {
    const {value} = e.target
    const {onChangeFilter} = this.props
    const momentDay = moment(value, 'L', true)
    if (momentDay.isValid()) {
      const momentDay = moment(value, 'L', true)
      if (typeFilter === 'to' && momentDay < this.state.from) {
        alert('Second date less first')
      }
      else {
        const conditionChanged = this.changeConditionValueFromOrTo(value, typeFilter)
        onChangeFilter(conditionChanged)
        this.daypicker.showMonth(momentDay.toDate())
      }
    }
    else {
      const conditionChanged = this.changeConditionValueFromOrTo(value, typeFilter)
      onChangeFilter(conditionChanged)
    }
  }

  handleDayClickBetween = (day) => {
    const {isSelectingLastDay} = this.state
    const {onChangeFilter} = this.props
    const typeFilter = 'from'
    const from = moment(this.props.condition.value.from).toDate()
    if (!isSelectingLastDay) {
      const conditionChanged = this.changeConditionValueFromOrTo(day, typeFilter)
      onChangeFilter(conditionChanged)
      this.setState({
        isSelectingLastDay: true,
        showOverlay: true,
      })
    }
    if (isSelectingLastDay && from && day < from) {
      const conditionChanged = this.changeConditionValueFromOrTo(day, typeFilter)
      onChangeFilter(conditionChanged)
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
    this.input.blur()
  }

  handleDayMouseEnter = (day) => {
    const {isSelectingLastDay} = this.state
    const from = moment(this.props.condition.value.from).toDate()
    if (!isSelectingLastDay || from && day < from || DateUtils.isSameDay(day, from)) {
      return
    }
    const conditionChanged = this.changeConditionValueFromOrTo(day, 'to')
    this.props.onChangeFilter(conditionChanged)
  }

  componentWillUnmount() {
    clearTimeout(this.cleanClickInside())
  }

  handleContainerMouseDown = () => {
    this.clickedInside = true
    this.cleanClickInside = setTimeout(() => {
      this.clickedInside = false
    }, 0)
  }

  handleInputFocus = () => {
    this.setState({
      showOverlay: true,
    })
  }

  handleInputFocusToFilter = () => {
    this.setState({
      showOverlayToFilter: true,
    })
  }

  handleInputBlur = () => {
    const showOverlay = this.clickedInside

    this.setState({
      showOverlay,
    })

    if (showOverlay) {
      this.input.focus()
    }
  }

  handleInputBlurToFilter = () => {
    const showOverlayToFilter = this.clickedInside

    this.setState({
      showOverlayToFilter,
    })

    if (showOverlayToFilter) {
      this.inputToFilter.focus()
    }
  }

  handleInputChange = (e) => {
    const {value} = e.target
    const {onChangeFilter} = this.props
    const momentDay = moment(value, 'L', true)
    if (momentDay.isValid()) {
      const conditionChanged = this.changeConditionValueFromOrTo(value, 'from')
      onChangeFilter(conditionChanged)
      this.daypicker.showMonth(momentDay.toDate())
    }
    else {
      const conditionChanged = this.changeConditionValueFromOrTo(value, 'from')
      onChangeFilter(conditionChanged)
    }
  }

  handleDayClick = (day) => {
    const conditionChanged = this.changeConditionValueFromOrTo(day, 'from')
    this.props.onChangeFilter(conditionChanged)
    this.setState({
      showOverlay: false,
    })
    this.input.blur()
  }

  handleInputKeyDown = (e) => {
    const {condition} = this.props
    if (e.keyCode === 13 &&
      (condition.value.from !== '' || condition.value.to !== '')
    ) {
      this.props.onApply()
    }
  }

  changeConditionType = (item) => {
    const {condition} = this.props
    return update(condition, {
      type: {$set: item},
    })
  }

  onChangeConditionType = (item) => {
    const conditionChanged = this.changeConditionType(item)
    this.props.onChangeFilter(conditionChanged)
  }

  resetFromAndToDate = () => {
    const {condition} = this.props
    return update(condition, {
      value: {
        from: {$set: ''},
        to: {$set: ''},
      },
    })
  }

  reset = () => {
    const condition = this.resetFromAndToDate()
    this.props.resetFilteredItems()
    this.props.onChangeFilter(condition)
    this.setState({
      isSelectingLastDay: false,
    })
  }

  render() {
    const {
      condition,
      conditions,
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

    return (
      <div onMouseDown={ this.handleContainerMouseDown }>
        <SwitchConditionFilterDate
          conditions={conditions}
          onChangeConditionType={this.onChangeConditionType}
          activeConditionDate={activeConditionDate}
        />
        <div className="input-and-clear-filter">
          <input
            type="text"
            ref={ (el) => {
              this.input = el
            } }
            placeholder="DD/MM/YYYY"
            value={ fromInput }
            onChange={ activeConditionDate === 'between' ?
              (e) => this.handleBetweenInputChange(e, 'from') : this.handleInputChange
            }
            className={cx({'input-date-between': activeConditionDate === 'between'}, 'input-filter')}
            onFocus={ this.handleInputFocus }
            onBlur={ activeConditionDate === 'between' ? undefined : this.handleInputBlur }
            onKeyDown={this.handleInputKeyDown}
          />
          <input
            type="text"
            ref={ (el) => {
              this.inputToFilter = el
            } }
            placeholder="DD/MM/YYYY"
            value={ toInput }
            onChange={(e) => this.handleBetweenInputChange(e, 'to') }
            onFocus={ this.handleInputFocusToFilter }
            onBlur={ this.handleInputBlurToFilter }
            className={cx({'hide-block': activeConditionDate !== 'between'}, 'input-date-between')}
            onKeyDown={this.handleInputKeyDown}
          />
          <div
            className={cx(
              {'show-block': fromInput !== '' || toInput !== ''},
              {'delete-input-filter-between': activeConditionDate === 'between'},
              'delete-input-filter hide-block')
            }
            onClick={this.reset}>
            &#10006;
          </div>
        </div>
        { (showOverlay || showOverlayToFilter) &&
        <div className="date-picker-filter">
          <div className="calendar-box">
            { activeConditionDate === 'between' ?
              <DayPicker
                className="Range"
                ref={ (el) => {
                  this.daypicker = el
                } }
                initialMonth={ selectedDay || undefined }
                selectedDays={ [!to ? from : {from, to}] }
                disabledDays={ {before: from} }
                modifiers={ {
                  start: from,
                  end: to,
                } }
                onDayClick={ this.handleDayClickBetween }
                onDayMouseEnter={ this.handleDayMouseEnter }
              />
              :
              <DayPicker
                ref={ (el) => {
                  this.daypicker = el
                } }
                initialMonth={ selectedDay || undefined }
                onDayClick={ this.handleDayClick }
                selectedDays={ day => DateUtils.isSameDay(selectedDay, day) }
              />
            }
          </div>
        </div>
        }
      </div>
    )
  }
}
