import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import update from 'react-addons-update'
import _ from 'lodash'
import SwitchConditionFilter from './SwitchConditionFilter'

export const conditions = [
  'equals',
  'notEquals',
  'less',
  'better',
]

function switchCoditionFilterNumber(condition, numberItem) {
  const numberFilter = condition.value
  switch (condition.type) {
    case 'equals': {
      console.log(numberItem === numberFilter)
      return numberItem === numberFilter
    }
    case 'less': {
      return numberItem < numberFilter
    }
    case 'better': {
      return numberItem > numberFilter
    }
    case 'notEquals': {
      return numberItem !== numberFilter
    }
    default: {
      return numberItem === numberFilter
    }
  }
}

export function numberFilter(condition, items, name) {
  console.log(condition, items, name)
  return items.filter(item => {
    const numberItem = item[name]
    return switchCoditionFilterNumber(condition, numberItem)
  })
}

export default class NumberBodyItemFilter extends Component {

  static propTypes = {
    condition: PropTypes.object.isRequired,
    onChangeFilter: PropTypes.func.isRequired,
    onApply: PropTypes.func.isRequired,
    resetFilteredItems: PropTypes.func.isRequired,
  }

  changeInput = (e) => {
    const {value} = e.target
    if (!isNaN(_.parseInt(value)) || value === '') {
      const {condition} = this.props
      const newCondition = update(condition, {
        value: {$set: value === '' ? '' : _.parseInt(value)},
      })
      this.props.onChangeFilter(newCondition)
    }
  }

  handleInputKeyDown = (e) => {
    const {condition} = this.props
    if (e.keyCode === 13 && condition.value !== '' ) {
      this.props.onApply()
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

  onChangeConditionType = (item) => {
    const {condition} = this.props
    const updatedCondition = update(condition, {
      type: {$set: item},
    })
    this.props.onChangeFilter(updatedCondition)
  }

  render() {
    const {
      condition,
    } = this.props
    const value = condition.value
    const activeConditionDate = condition.type
    return (
      <div className="input-filter-box">
        <SwitchConditionFilter
          conditions={conditions}
          onChangeConditionType={this.onChangeConditionType}
          activeCondition={activeConditionDate}
        />
        <input
          type="text"
          className="input-filter"
          placeholder={'Only numbers'}
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
