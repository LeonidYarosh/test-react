import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import update from 'react-addons-update'
import _ from 'lodash'
import InputFilter from './InputFilter'

export const conditions = [
  'equals',
  'contain',
  'notEquals',
]

export function textFilter(condition, items, name) {
  return items.filter(item => {
    const inputValue = condition.value.toLowerCase()
    const itemValue = item[name].toLowerCase()
    return _.includes(itemValue, inputValue)
  })
}

export default class TextBodyFilterItem extends Component {

  static propTypes = {
    placeholderInput: PropTypes.string.isRequired,
    condition: PropTypes.object.isRequired,
    onChangeFilter: PropTypes.func.isRequired,
    onApply: PropTypes.func.isRequired,
    resetFilteredItems: PropTypes.func.isRequired,
  }

  changeInput = (e) => {
    const {value} = e.target
    const {condition} = this.props
    if (value === '') {
      this.reset()
    }
    else {
      const newCondition = update(condition, {
        value: {$set: value},
      })
      this.props.onChangeFilter(newCondition)
    }
  }

  reset = () => {
    const {condition} = this.props
    const newCondition = update(condition, {
      value: {$set: ''},
    })
    this.props.resetFilteredItems()
    this.props.onChangeFilter(newCondition)
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
        <InputFilter
          placeholder={placeholderInput}
          value={value}
          onChange={this.changeInput}
          onKeyDown={this.handleInputKeyDown}
          reset={this.reset}
          classNameReset={cx({'show-block': value !== ''})}
        />
      </div>
    )
  }
}
