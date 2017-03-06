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
    changeDate: PropTypes.func.isRequired,
    filterChanged: PropTypes.bool,
    filterData: PropTypes.func,
    conditions: PropTypes.array.isRequired,
    handleChangeCondition: PropTypes.func,
    activeConditionDate: PropTypes.string,
    changeInputFilter: PropTypes.func,
    resetFilterDate: PropTypes.func,
    resetFilterInput: PropTypes.func,
  }

  dateItemFilter = (caption) => {
    return caption === 'Date Submitted' ? 'date' : undefined
  }

  render() {
    const {
      changeInputFilter,
      fields,
      resetFilterInput,
      filterChanged,
      filterData,
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
            fields.map(field => {
              const {caption, type, name} = field
              const Filter = filterItemType[FILTERS_MAP[name] || type]
              return (
                <ItemFilter
                  key={caption}
                  caption={caption}
                >
                  <Filter
                    { ...this.props }
                    placeholderInput={caption}
                    changeInputFilter={value => changeInputFilter(name, value)}
                    name = {name}
                    resetFilterInput={resetFilterInput}
                  />
                </ItemFilter>
              )
            })
          }
          <ApplyFilter
            filterChanged={filterChanged}
            filterData={filterData}
          />
        </div>
      </Scrollbars>
    )
  }
}
