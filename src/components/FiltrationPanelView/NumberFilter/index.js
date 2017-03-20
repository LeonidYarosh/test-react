import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import SwitchFilterCondition from '../Shared/SwitchFilterCondition'
import InputFilter from '../Shared/InputFilter'

export const conditions = [
  'equals',
  'notEquals',
  'less',
  'greater',
]

function filteringByCondition(numberFilter, numberItem, type) {
  switch (type) {
    case 'equals': {
      return numberItem === numberFilter
    }
    case 'less': {
      return numberItem < numberFilter
    }
    case 'greater': {
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

export function FiltrationFunction(condition, items, name) {
  return items.filter(item => {
    const numberItem = item[name]
    return filteringByCondition(condition.value, numberItem, condition.type)
  })
}

export default class NumberFilter extends Component {

  static propTypes = {
    condition: PropTypes.object.isRequired,
    onChangeFilter: PropTypes.func.isRequired,
    onApply: PropTypes.func.isRequired,
  }

  validationValue = (value) => {
    return !isNaN(_.parseInt(value)) ? _.parseInt(value) : false
  }

  render() {
    const {
      condition,
      onChangeFilter,
      onApply,
    } = this.props
    const value = condition.value
    const activeConditionDate = condition.type
    return (
      <div className={cx('input-filter-box')}>
        <SwitchFilterCondition
          conditions={conditions}
          condition={condition}
          onChangeFilter={onChangeFilter}
          activeCondition={activeConditionDate}
        />
        <InputFilter
          placeholder={'Only numbers'}
          value={value}
          onApply={onApply}
          onChangeFilter={onChangeFilter}
          condition={condition}
          filterType="number"
          classNameReset={cx({'show-block': value !== ''})}
          validationValue = {this.validationValue}
        />
      </div>
    )
  }
}
