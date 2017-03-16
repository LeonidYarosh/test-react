import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import _ from 'lodash'
import InputFilter from '../Shared/InputFilter'
import SwitchFilterCondition from '../Shared/SwitchFilterCondition'

export const conditions = [
  'equals',
  'contain',
  'notContain',
]

function switchCoditionFilterText(inputValue, itemValue, type) {
  switch (type) {
    case 'equals': {
      return inputValue === itemValue
    }
    case 'contain': {
      return _.includes(itemValue, inputValue)
    }
    case 'notContain': {
      return !_.includes(itemValue, inputValue)
    }
    default: {
      return inputValue === itemValue
    }
  }
}

export function textFilter(condition, items, name) {
  return items.filter(item => {
    const inputValue = condition.value.toLowerCase()
    const itemValue = item[name].toLowerCase()
    return switchCoditionFilterText(inputValue, itemValue, condition.type)
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

  render() {
    const {
      placeholderInput,
      condition,
      onChangeFilter,
      onApply,
      resetFilteredItems,
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
          placeholder={placeholderInput}
          value={value}
          onApply={onApply}
          onChangeFilter={onChangeFilter}
          condition={condition}
          resetFilteredItems={resetFilteredItems}
          filterType="text"
          classNameReset={cx({'show-block': value !== ''})}
        />
      </div>
    )
  }
}
