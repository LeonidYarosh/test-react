import React, {Component, PropTypes} from 'react'
import moment from 'moment'
import DayPicker, {DateUtils} from 'react-day-picker'
import 'react-day-picker/lib/style.css'
import SwitchConditionFilterDate from './SwitchConditionFilterDate'
import cx from 'classnames'

export default class DateBodyItemFilter extends Component {

  /*
   * <InputDatePicker
   activeConditionDate = {activeConditionDate}
   from = {from}
   to = {to}
   handleDayClickBetween = { this.handleDayClickBetween}
   handleDayMouseEnter={ this.handleDayMouseEnter }
   daypickerChange = { this.daypickerChange}
   selectedDay = { this.state.selectedDay}
   handleDayClick = { this.handleClick}
   />
   * */

  constructor(props) {
    super(props)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleInputFocus = this.handleInputFocus.bind(this)
    this.handleInputBlur = this.handleInputBlur.bind(this)
    this.handleContainerMouseDown = this.handleContainerMouseDown.bind(this)
    this.handleInputKeyDown = this.handleInputKeyDown.bind(this)
    this.reset = this.reset.bind(this)
  }

  static propTypes = {
    changeEqualsDate: PropTypes.func.isRequired,
    filterData: PropTypes.func.isRequired,
    condition: PropTypes.array.isRequired,
    handleChangeCondition: PropTypes.func,
    activeConditionDate: PropTypes.string,
    changeBetweenFromDate: PropTypes.func,
    changeBetweenToDate: PropTypes.func,
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

  componentWillUnmount() {
    clearTimeout(this.clickTimeout)
  }

  input = null
  daypicker = null
  clickedInside = false
  clickTimeout = null

  handleContainerMouseDown() {
    this.clickedInside = true
    this.clickTimeout = setTimeout(() => {
      this.clickedInside = false
    }, 0)
  }

  handleInputFocus() {
    this.setState({
      showOverlay: true,
    })
  }

  handleInputBlur() {
    const showOverlay = this.clickedInside

    this.setState({
      showOverlay,
    })

    if (showOverlay) {
      this.input.focus()
    }
  }

  handleInputChange(e) {
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
        this.props.changeEqualsDate(momentDay))
    }
    else {
      this.setState({value, selectedDay: null},
        this.props.changeEqualsDate(''))
    }
  }

  handleBetweenInputChange(e, typeFilter) {
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
          },
          () => {
            this.daypicker.showMonth(this.state.selectedDay)
          },
          typeFilter === 'to' ? this.props.changeBetweenToDate(momentDay) : this.props.changeBetweenFromDate(momentDay)
        )
      }
      else {
        this.setState(
          {
            [typeFilter]: value.toDate(),
            selectedDay: null,
          },
          typeFilter === 'to' ? this.props.changeBetweenToDate(momentDay) : this.props.changeBetweenFromDate(momentDay))
      }
    }
  }


  handleDayClick = (day) => {
    console.log('click')
    this.setState({
      value: moment(day).format('L'),
      selectedDay: day,
      showOverlay: false,
    }, this.props.changeEqualsDate(moment(day).format('L')))
    this.input.blur()
  }

  handleInputKeyDown(e) {
    if (e.keyCode === 13 && this.state.value !== '' ||
      e.keyCode === 13 && this.state.from !== '' ||
      e.keyCode === 13 && this.state.to !== ''
    ) {
      this.props.filterData()
    }
  }

  handleDayClickBetween = (day) => {
    console.log('between')
    const {from, isSelectingLastDay} = this.state
    if (!isSelectingLastDay) {
      this.setState({
        isSelectingLastDay: true,
        from: day,
        to: null,
        showOverlay: false,
      }, this.props.changeBetweenFromDate(moment(day).format('L')))
    }
    if (isSelectingLastDay && from && day < from) {
      this.setState({
        from: day,
        to: null,
        showOverlay: false,
      }, this.props.changeBetweenFromDate(moment(day).format('L')))
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
    console.log('enter')
    const {isSelectingLastDay, from} = this.state
    if (!isSelectingLastDay || (from && day < from) || DateUtils.isSameDay(day, from)) {
      return
    }
    this.setState({
      to: day,
    }, this.props.changeBetweenToDate(moment(day).format('L')))
  }


  reset() {
    this.setState({
      from: null,
      to: null,
      isSelectingLastDay: false,
    }, this.props.changeEqualsDate(''))
  }

  daypickerChange = (el) => {
    this.daypicker = el
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
    } = this.state

    let fromInput = ''
    let toInput = ''

    from === null ? fromInput = '' : fromInput = moment(from).format('L')
    to === null ? toInput = '' : toInput = moment(to).format('L')

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
            onBlur={ this.handleInputBlur }
            className={cx({'input-date-between': activeConditionDate === 'between'}, 'input-date')}
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
            className={cx({'delete-input-filter-between': activeConditionDate === 'between'}, 'delete-input-filter')}
            onClick={this.reset}
          >&#10006;</div>
        </div>
        { this.state.showOverlay &&
        <div className="date-picker-filter">
          <div className="calendar-box">
            {
              activeConditionDate === 'between' ?
                <DayPicker
                  className="Range"
                  initialMonth={ this.state.selectedDay || undefined }
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
                  initialMonth={ this.state.selectedDay || undefined }
                  onDayClick={ this.handleDayClick }
                  selectedDays={ day => DateUtils.isSameDay(this.state.selectedDay, day) }
                />
            }
          </div>
        </div>
        }
      </div>
    )
  }
}
