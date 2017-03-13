import React, {Component, PropTypes} from 'react'

export default class InputFilter extends Component {

  static propTypes = {
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
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
      <div className="input-and-clear-filter">
        <input
          type="text"
          className="input-filter"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
        <div
          className={classNameReset + ' delete-input-filter hide-block'}
          onClick={reset}
        >&#10006;</div>
      </div>
    )
  }
}

