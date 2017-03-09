import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import update from 'react-addons-update'
import _ from 'lodash'

export function textFilter(condition, items, name) {
  return items.filter(item => {
    const inputValue = condition.value.toLowerCase()
    const itemValue = item[name].toLowerCase()
    return _.includes(itemValue, inputValue)
  })
}

export default class InputFilter extends Component {
  state = {
    value: '',
  }

  static propTypes = {
    placeholderInput: PropTypes.string.isRequired,
    condition: PropTypes.object.isRequired,
    onChangeFilter: PropTypes.func.isRequired,
    onApply: PropTypes.func.isRequired,
    resetFilteredItems: PropTypes.func.isRequired,
  }

  changeConditionInputValue = (value) => {
    const {condition} = this.props
    return update(condition, {
      value: {$set: value},
    })
  }

  changeInput = (e) => {
    const {value} = e.target
    const conditionChanged = this.changeConditionInputValue(value)
    this.props.onChangeFilter(conditionChanged)
  }

  resetInputValue = () => {
    const {condition} = this.props
    return update(condition, {
      value: {$set: ''},
    })
  }

  reset = () => {
    const condition = this.resetInputValue()
    this.props.resetFilteredItems()
    this.props.onChangeFilter(condition)
  }

  handleInputKeyDown = (e) => {
    const {condition} = this.props
    if (e.keyCode === 13 && condition.value !== '' ) {
      this.props.onApply()
    }
  }

  render() {
    const {
      placeholderInput,
      condition,
    } = this.props
    const value = condition.value

    return (
      <div className="input-filter-box">
        <input
          type="text"
          className="input-filter"
          placeholder={placeholderInput}
          value={value}
          onChange={this.changeInput}
          onKeyDown={this.handleInputKeyDown}
        />
        <div
          className={cx({'show-block': value !== ''}, 'delete-input-filter hide-block')}
          onClick={this.reset}
        >&#10006;</div>
      </div>

    )
  }
}
