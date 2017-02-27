import React, {Component, PropTypes} from 'react'
import ItemFilter from './ItemFilter'
import TextBodyItemFilter from './TextBodyFilterItem'
import NumberBodyItemFilter from './NumberBodyItemFilter'
import EnumBodyItemFilter from './EnumBodyItemFilter'
import DateBodyItemFilter from './DateBodyItemFilter'
import ApplyFilter from '../ApplyFilter'
import {Scrollbars} from 'react-custom-scrollbars'

const filterItemType = {
  text: TextBodyItemFilter,
  number: NumberBodyItemFilter,
  enum: EnumBodyItemFilter,
  date: DateBodyItemFilter,
}

const FILTERS_MAP = {
  'Date Submitted': 'date',
}

export default class FilterPanel extends Component {

  static propTypes = {
    fields: PropTypes.array.isRequired,
    changeEqualsDate: PropTypes.func.isRequired,
    changeFilter: PropTypes.bool,
    filterData: PropTypes.func,
    condition: PropTypes.array.isRequired,
    handleChangeCondition: PropTypes.func,
    activeConditionDate: PropTypes.string,
  }

  dateItemFilter = (caption) => {
    return caption === 'Date Submitted' ? 'date' : undefined
  }

  render() {
    return (
      <Scrollbars
        autoHide
        universal={true}
        style={{ width: 240}}
        className = 'scroll-box'
      >
        <div className="filter-panel">
          {
            this.props.fields.map(field => {
              const {caption, type, name} = field
              const Filter = filterItemType[FILTERS_MAP[name] || type] // _.get(filterItemType, this.dateItemFilter(caption), filterItemType[type])
              return (
                <ItemFilter
                  key={caption}
                  caption={caption}
                >
                  <Filter
                    { ...this.props }
                  />
                </ItemFilter>
              )
            })
          }
          <ApplyFilter
            changeFilter={this.props.changeFilter}
            filterData={this.props.filterData}
          />
        </div>
      </Scrollbars>
    )
  }
}
