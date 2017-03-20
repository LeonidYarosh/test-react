import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import update from 'react-addons-update'
import './style.sass'

export default class InputFilter extends Component {

  static propTypes = {
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    onApply: PropTypes.func.isRequired,
    classNameReset: PropTypes.string.isRequired,
    onChangeFilter: PropTypes.func.isRequired,
    condition: PropTypes.object.isRequired,
    validationValue: PropTypes.func.isRequired,
  }

  onChange = (e) => {
    const {value} = e.target
    const {validationValue} = this.props
    const newValue = validationValue(value)

    if (newValue) {
      const {condition, onChangeFilter} = this.props
      const newCondition = update(condition, {
        value: {$set: newValue},
      })
      onChangeFilter(newCondition)
    }
    if (value === '') {
      this.reset()
    }
  }

  onKeyDown = (e) => {
    const {onApply} = this.props
    if (e.keyCode === 13) {
      onApply()
    }
  }

  reset = () => {
    const {condition, onChangeFilter} = this.props
    const newCondition = update(condition, {
      value: {$set: ''},
    })
    onChangeFilter(newCondition)
  }

  render() {
    const {
      placeholder,
      value,
      classNameReset,
    } = this.props

    return (
      <div className={cx('input-and-clear-filter')}>
        <input
          type="text"
          className={cx('input-filter')}
          placeholder={placeholder}
          value={value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
        />
        <div
          className={cx(classNameReset + ' delete-input-filter hide-block')}
          onClick={this.reset}
        >&#10006;</div>
      </div>
    )
  }
}

