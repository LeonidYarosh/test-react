import React, {Component, PropTypes} from 'react'
import ItemFilter from './ItemFilter'
import TextBodyItemFilter from './TextBodyFilterItem'
import DateBodyItemFilter from './DateBodyFilterItem'
import NumberBodyItemFilter from './NumberBodyFilterItem'
import EnumBodyItemFilter from './EnumBodyFilterItem'
import ApplyFilter from '../ApplyFilter'
import {Scrollbars} from 'react-custom-scrollbars'

const filterItemType = {
  text: TextBodyItemFilter,
  number: NumberBodyItemFilter,
  enum: EnumBodyItemFilter,
  date: DateBodyItemFilter,
}

export default class FilterPanel extends Component {

  static propTypes = {
    fields: PropTypes.array.isRequired,
    onChangeFilter: PropTypes.func.isRequired,
    onApply: PropTypes.func.isRequired,
    showApply: PropTypes.bool.isRequired,
  }

  dateItemFilter = (caption) => {
    return caption === 'Date Submitted' ? 'date' : undefined
  }

  render() {
    const {
      fields,
      onApply,
      onChangeFilter,
      showApply,
    } = this.props

    return (
      <Scrollbars
        autoHide
        universal={true}
        style={{width: 240}}
        className='scroll-box'
      >
        <div className="filter-panel">
          {
            fields.map((field, i) => {
              const {caption, type} = field
              const Filter = filterItemType[type]
              return (
                <ItemFilter
                  key={caption}
                  caption={caption}
                >
                  <Filter
                    { ...this.props }
                    condition={field.condition}
                    onChangeFilter = { condition => onChangeFilter(i, condition)}
                    placeholderInput={caption}
                  />
                </ItemFilter>
              )
            })
          }
          <ApplyFilter
            showApply={showApply}
            onApply={onApply}
          />
        </div>
      </Scrollbars>
    )
  }
}
