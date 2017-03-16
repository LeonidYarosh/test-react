import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import './style.sass'

export default class InputFilter extends Component {

  static propTypes = {
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    onChange: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    classNameReset: PropTypes.string.isRequired,
  }

  render() {
    const {
      placeholder,
      value,
      onChange,
      onKeyDown,
      reset,
      classNameReset,
    } = this.props

    return (
      <div className={cx('input-and-clear-filter')}>
        <input
          type="text"
          className={cx('input-filter')}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
        <div
          className={cx(classNameReset + ' delete-input-filter hide-block')}
          onClick={reset}
        >&#10006;</div>
      </div>
    )
  }
}

