import React, {Component, PropTypes} from 'react'
import moment from 'moment'
import DayPicker, {DateUtils} from 'react-day-picker'
import 'react-day-picker/lib/style.css'
import SwitchConditionFilterDate from './SwitchConditionFilterDate'
import cx from 'classnames'
import {formattingDate} from '../../util/formatingDataContent'

export default class DateBodyItemFilter extends Component {

  static propTypes = {
    filterData: PropTypes.func.isRequired,
    conditions: PropTypes.array.isRequired,
    handleChangeCondition: PropTypes.func,
    activeConditionDate: PropTypes.string,
    changeDate: PropTypes.func,
    resetFilterDate: PropTypes.func,
  }

  state = {
    showOverlay: false,
    showOverlayToFilter: false,
    value: '',
    selectedDay: null,
    isSelectingLastDay: false,
    from: null,
    to: null,
  }

  input = null
  inputToFilter = null
  daypicker = null
  clickedInside = false
  cleanClickInside = null
  oneInputValue = 'dateFilter'
  fromChange = 'fromDateFilter'
  toChange = 'toDateFilter'

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
    const momentDay = moment(value, 'L', true)
    if (momentDay.isValid()) {
      this.props.changeDate(this.oneInputValue, momentDay)
      this.setState(
        {
          selectedDay: momentDay.toDate(),
          value,
        },
        () => {
          this.daypicker.showMonth(this.state.selectedDay)
        }
        )
    }
    else {
      this.props.changeDate(this.oneInputValue, '')
      this.setState({value, selectedDay: null})
    }
  }

  handleBetweenInputChange = (e, typeFilter) => {
    const {value} = e.target
    const momentDay = moment(value, 'L', true)
    if (typeFilter === 'to' && momentDay < this.state.from) {
      alert('Second date less first')
    }
    else {
      if (momentDay.isValid()) {
        this.props.changeDate(typeFilter === 'to' ? this.toChange : this.fromChange, momentDay)
        this.setState(
          {
            selectedDay: momentDay.toDate(),
            [typeFilter]: momentDay.toDate(),
          },
          () => {
            this.daypicker.showMonth(this.state.selectedDay)
          })
      }
      else {
        this.props.changeDate(typeFilter === 'to' ? this.toChange : this.fromChange, momentDay)
        this.setState(
          {
            [typeFilter]: value,
            selectedDay: null,
          })
      }
    }
  }

  handleDayClick = (day) => {
    this.props.changeDate(this.oneInputValue, formattingDate(day))
    this.setState({
      value: formattingDate(day),
      selectedDay: day,
      showOverlay: false,
    })
    this.input.blur()
  }

  handleInputKeyDown = (e) => {
    if (e.keyCode === 13 &&
      (this.state.value !== '' || this.state.from !== '' ||
      this.state.to !== '')
    ) {
      this.props.filterData()
    }
  }

  handleDayClickBetween = (day) => {
    const {from, isSelectingLastDay} = this.state
    if (!isSelectingLastDay) {
      this.props.changeDate(this.fromChange, formattingDate(day))
      this.setState({
        isSelectingLastDay: true,
        from: day,
        to: null,
        showOverlay: true,
      })
    }
    if (isSelectingLastDay && from && day < from) {
      this.props.changeDate(this.fromChange, formattingDate(day))
      this.setState({
        from: day,
        to: null,
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
    const {isSelectingLastDay, from} = this.state
    if (!isSelectingLastDay || from && day < from || DateUtils.isSameDay(day, from)) {
      return
    }
    this.props.changeDate(this.toChange, formattingDate(day))
    this.setState(
      {
        to: day,
      }
    )
  }

  reset = () => {
    this.props.resetFilterDate()
    this.setState({
      value: '',
      from: null,
      to: null,
      isSelectingLastDay: false,
      selectedDay: null,
    })
  }

  render() {
    const {
      conditions,
      handleChangeCondition,
      activeConditionDate,
    } = this.props

    const {
      value,
      from,
      to,
      selectedDay,
      showOverlay,
      showOverlayToFilter,
    } = this.state
    let fromInput = ''
    let toInput = ''
    let toSelectDays = false

    if (value !== '') {
      fromInput = value
    }

    if (from !== null) {
      fromInput = moment(from, 'L', true).isValid() ? formattingDate(from) : from
    }

    if (to === null) {
      toInput = ''
    }
    else {
      if (moment(to, 'L', true).isValid()) {
        toInput = formattingDate(to)
        toSelectDays = true
      }
      else toInput = to
    }

    return (
      <div onMouseDown={ this.handleContainerMouseDown }>
        <SwitchConditionFilterDate
          conditions={conditions}
          handleChangeCondition={handleChangeCondition}
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
            onChange={ activeConditionDate === 'between' ? (e) => this.handleBetweenInputChange(e, 'from') : this.handleInputChange}
            onFocus={ this.handleInputFocus }
            onBlur={ activeConditionDate === 'between' ? undefined : this.handleInputBlur }
            className={cx({'input-date-between': activeConditionDate === 'between'}, 'input-filter')}
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
              {'show-block': fromInput !== '' || value !== '' || toInput !== ''},
              {'delete-input-filter-between': activeConditionDate === 'between'},
              'delete-input-filter hide-block')
            }
            onClick={this.reset}
          >&#10006;</div>
        </div>
        { (showOverlay || showOverlayToFilter) &&
        <div className="date-picker-filter">
          <div className="calendar-box">
            {
              activeConditionDate === 'between' ?
                <DayPicker
                  className="Range"
                  ref={ (el) => {
                    this.daypicker = el
                  } }
                  initialMonth={ selectedDay || undefined }
                  selectedDays={ [!toSelectDays ? from : {from, to}] }
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
