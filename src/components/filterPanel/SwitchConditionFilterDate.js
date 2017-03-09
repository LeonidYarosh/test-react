import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

export default class SwitchConditionFilterDate extends Component {

  static propTypes = {
    conditions: PropTypes.array.isRequired,
    onChangeConditionType: PropTypes.func.isRequired,
    activeConditionDate: PropTypes.string.isRequired,
  }

  render() {
    const {
      conditions,
      onChangeConditionType,
      activeConditionDate,
    } = this.props
    return (
      <div className="conditions-filter-date">
        <p>Conditions:</p>
        {
          conditions.map((item, i) => {
            return <div
              className={cx({'active-condition': item === activeConditionDate}, 'item-condition')}
              key={i}
              onClick={ () => onChangeConditionType(item) }
            >
              {item}
            </div>
          })
        }
      </div>
    )
  }
}
