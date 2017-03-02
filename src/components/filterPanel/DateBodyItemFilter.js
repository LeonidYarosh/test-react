import React, {Component, PropTypes} from 'react'
import moment from 'moment'
import DayPicker, {DateUtils} from 'react-day-picker'
import 'react-day-picker/lib/style.css'
import SwitchConditionFilterDate from './SwitchConditionFilterDate'
import cx from 'classnames'

export default class DateBodyItemFilter extends Component {

  static propTypes = {
    filterData: PropTypes.func.isRequired,
    condition: PropTypes.array.isRequired,
    handleChangeCondition: PropTypes.func,
    activeConditionDate: PropTypes.string,
    changeDate: PropTypes.func,
    resetFilterDate: PropTypes.func,
  }

  state = {
    showOverlay: false,
    value: '',
    selectedDay: null,
    isSelectingLastDay: false,
    from: null,
    to: null,
    fromInput: '',
    toInput: '',
  }

  input = null
  daypicker = null
  clickedInside = false
  clickTimeout = null
  oneInputValue = 'dateFilter'
  fromChange = 'fromDateFilter'
  toChange = 'toDateFilter'

  componentWillUnmount() {
    clearTimeout(this.clickTimeout())
  }

  handleContainerMouseDown = () => {
    this.clickedInside = true
    this.clickTimeout = setTimeout(() => {
      this.clickedInside = false
    }, 0)
  }

  handleInputFocus = () => {
    this.setState({
      showOverlay: true,
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

  handleInputChange = (e) => {
    const {value} = e.target
    const momentDay = moment(value, 'L', true)
    if (momentDay.isValid()) {
      this.setState(
        {
          selectedDay: momentDay.toDate(),
          value,
        },
        () => {
          this.daypicker.showMonth(this.state.selectedDay)
        },
        this.props.changeDate(this.oneInputValue, momentDay))
    }
    else {
      this.setState({value, selectedDay: null},
        this.props.changeDate(this.oneInputValue, '')
      )
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
        this.setState(
          {
            selectedDay: momentDay.toDate(),
            [typeFilter]: momentDay.toDate(),
            [typeFilter + 'Input']: value,
          },
          () => {
            this.daypicker.showMonth(this.state.selectedDay)
          },
          this.props.changeDate(typeFilter === 'to' ? this.toChange : this.fromChange, momentDay)
        )
      }
      else {
        this.setState(
          {
            [typeFilter + 'Input']: value,
            selectedDay: null,
          },
          this.props.changeDate(typeFilter === 'to' ? this.toChange : this.fromChange, momentDay)
        )
      }
    }
  }

  handleDayClick = (day) => {
    this.setState({
      value: moment(day).format('L'),
      selectedDay: day,
      showOverlay: false,
    }, this.props.changeDate(this.oneInputValue, moment(day).format('L')))
    this.input.blur()
  }

  handleInputKeyDown = (e) => {
    if (e.keyCode === 13 && this.state.value !== '' ||
      e.keyCode === 13 && this.state.from !== '' ||
      e.keyCode === 13 && this.state.to !== ''
    ) {
      this.props.filterData()
    }
  }

  handleDayClickBetween = (day) => {
    const {from, isSelectingLastDay} = this.state
    if (!isSelectingLastDay) {
      this.setState({
        isSelectingLastDay: true,
        from: day,
        fromInput: moment(day).format('L'),
        to: null,
        showOverlay: true,
      }, this.props.changeDate(this.fromChange, moment(day).format('L')))
    }
    if (isSelectingLastDay && from && day < from) {
      this.setState({
        from: day,
        fromInput: day,
        to: null,
        showOverlay: true,
      }, this.props.changeDate(this.fromChange, moment(day).format('L')))
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
    this.setState(
      {
        to: day,
        toInput: moment(day).format('L'),
      }, this.props.changeDate(this.toChange, moment(day).format('L'))
    )
  }

  reset = () => {
    this.setState({
      value: '',
      from: null,
      to: null,
      fromInput: '',
      toInput: '',
      isSelectingLastDay: false,
      selectedDay: null,
    }, this.props.resetFilterDate())
  }

  render() {
    const {
      condition,
      handleChangeCondition,
      activeConditionDate,
    } = this.props

    const {
      value,
      from,
      to,
      fromInput,
      toInput,
      selectedDay,
      showOverlay,
    } = this.state

    return (
      <div onMouseDown={ this.handleContainerMouseDown }>
        <SwitchConditionFilterDate
          condition={condition}
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
            value={ activeConditionDate === 'between' ? fromInput : value }
            onChange={ activeConditionDate === 'between' ? (e) => this.handleBetweenInputChange(e, 'from') : this.handleInputChange}
            onFocus={ this.handleInputFocus }
            onBlur={ activeConditionDate === 'between' ? undefined : this.handleInputBlur }
            className={cx({'input-date-between': activeConditionDate === 'between'}, 'input-filter')}
            onKeyDown={this.handleInputKeyDown}
          />
          <input
            type="text"
            ref={ (el) => {
              this.input = el
            } }
            placeholder="DD/MM/YYYY"
            value={ toInput }
            onChange={(e) => this.handleBetweenInputChange(e, 'to') }
            onFocus={ this.handleInputFocus }
            onBlur={ this.handleInputBlur }
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
        { showOverlay &&
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
                  selectedDays={ [from, {from, to}] }
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
