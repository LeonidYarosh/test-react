import React, {Component, PropTypes} from 'react'
import moment from 'moment'
import DayPicker, {DateUtils} from 'react-day-picker'
import 'react-day-picker/lib/style.css'

export default class DateBodyItemFilter extends Component {

  constructor(props) {
    super(props)
    this.handleDayClick = this.handleDayClick.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleInputFocus = this.handleInputFocus.bind(this)
    this.handleInputBlur = this.handleInputBlur.bind(this)
    this.handleContainerMouseDown = this.handleContainerMouseDown.bind(this)
    this.handleClearInputClick = this.handleClearInputClick.bind(this)
    this.handleInputKeyDown = this.handleInputKeyDown.bind(this)
  }

  static propTypes = {
    changeEqualsDate: PropTypes.func.isRequired,
    filterData: PropTypes.func.isRequired,
  }

  state = {
    showOverlay: false,
    value: '',
    selectedDay: null,
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
    // The input's onBlur method is called from a queue right after onMouseDown event.
    // setTimeout adds another callback in the queue, but is called later than onBlur event
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

    // Force input's focus if blur event was caused by clicking on the calendar
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


  handleDayClick(day) {
    this.setState({
      value: moment(day).format('L'),
      selectedDay: day,
      showOverlay: false,
    }, this.props.changeEqualsDate(moment(day).format('L')))
    this.input.blur()
  }

  handleClearInputClick() {
    this.setState(
      {
        value: '',
      },
      this.props.changeEqualsDate(''))
  }

  handleInputKeyDown(e) {
    if (e.keyCode === 13 && this.state.value !== '') {
      this.props.filterData()
    }
  }

  render() {
    return (
      <div onMouseDown={ this.handleContainerMouseDown }>
        <input
          type="text"
          ref={ (el) => {
            this.input = el
          } }
          placeholder="DD/MM/YYYY"
          value={ this.state.value }
          onChange={ this.handleInputChange }
          onFocus={ this.handleInputFocus }
          onBlur={ this.handleInputBlur }
          className="input-date"
          onKeyDown={this.handleInputKeyDown}
        />
        <div
          className="delete-input-filter"
          onClick={this.handleClearInputClick}
        >&#10006;</div>
        { this.state.showOverlay &&
        <div className="date-picker-filter">
          <div className="calendar-box">
            <DayPicker
              ref={ (el) => {
                this.daypicker = el
              } }
              initialMonth={ this.state.selectedDay || undefined }
              onDayClick={ this.handleDayClick }
              selectedDays={ day => DateUtils.isSameDay(this.state.selectedDay, day) }
            />
          </div>
        </div>
        }
      </div>
    )
  }
}
