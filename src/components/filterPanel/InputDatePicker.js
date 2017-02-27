import React, {Component, PropTypes} from 'react'
import DayPicker, {DateUtils} from 'react-day-picker'
import 'react-day-picker/lib/style.css'
import enhanceWithClickOutside from 'react-click-outside'

class InputDatePicker extends Component {

  state = {
    isOpened: false,
  }

  handleClickOutside = () => {
    this.setState({ isOpened: false })
  }

  static propTypes = {
    activeConditionDate: PropTypes.string.isRequired,
    from: PropTypes.object,
    to: PropTypes.object,
    handleDayClickBetween: PropTypes.func,
    handleDayMouseEnter: PropTypes.func,
    daypickerChange: PropTypes.func,
    selectedDay: PropTypes.object,
    handleDayClick: PropTypes.func,
  }


  render() {
    const {
      activeConditionDate,
      from,
      to,
      handleDayClickBetween,
      handleDayMouseEnter,
      daypickerChange,
      selectedDay,
      handleDayClick,
    } = this.props
    return (
      <div className="calendar-box">
        {
          activeConditionDate === 'between' ?
            <DayPicker
              className="Range"
              fromMonth={ from }
              selectedDays={ [from, {from, to}] }
              disabledDays={ {before: from} }
              modifiers={ {
                start: from,
                end: to,
              } }
              onDayClick={(e) => {console.log(e); handleDayClickBetween()} }
              onDayMouseEnter={(e) => {console.log(e, 123); handleDayMouseEnter()}}
            />
            :
            <DayPicker
              ref={ (el) => {
                daypickerChange(el)
              } }
              initialMonth={ selectedDay || undefined }
              onDayClick={(e) => {console.log(e); handleDayClick()}}
              selectedDays={ day => DateUtils.isSameDay(selectedDay, day) }
            />
        }
      </div>
    )
  }
}

export default enhanceWithClickOutside(InputDatePicker)
