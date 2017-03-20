import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import update from 'react-addons-update'
import './style.sass'

export default class SwitchConditionFilterDate extends Component {

  static propTypes = {
    condition: PropTypes.object.isRequired,
    conditions: PropTypes.array.isRequired,
    onChangeFilter: PropTypes.func.isRequired,
    activeCondition: PropTypes.string.isRequired,
  }

  onChangeConditionType = (item) => {
    const {condition, onChangeFilter} = this.props
    const updatedCondition = update(condition, {
      type: {$set: item},
    })
    onChangeFilter(updatedCondition)
  }

  render() {
    const {
      conditions,
      activeCondition,
    } = this.props
    return (
      <div className={cx('conditions-filter-date')}>
        <p>Conditions:</p>
        {
          conditions.map((item, i) => {
            return <div
              className={cx({'active-condition': item === activeCondition}, 'item-condition')}
              key={i}
              onClick={() => this.onChangeConditionType(item)}
            >
              {item}
            </div>
          })
        }
      </div>
    )
  }
}
