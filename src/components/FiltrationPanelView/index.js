import React, {Component, PropTypes} from 'react'
import ItemFilter from './FilterWrapper'
import TextBodyItemFilter from './TextFilter'
import DateBodyItemFilter from './DateFilter'
import NumberBodyItemFilter from './NumberFilter'
import EnumBodyItemFilter from './EnumFilter'
import ApplyFilter from './Shared/ApplyFilter'
import {Scrollbars} from 'react-custom-scrollbars'
import cx from 'classnames'
import './style.sass'

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
        className={cx('scroll-box')}
      >
        <div className={cx('filter-panel')}>
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
