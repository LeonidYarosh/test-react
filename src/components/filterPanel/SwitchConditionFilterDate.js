import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

export default class SwitchConditionFilterDate extends Component {

  static propTypes = {
    conditions: PropTypes.array.isRequired,
    handleChangeCondition: PropTypes.func,
    activeConditionDate: PropTypes.string,
  }

  render() {
    const {
      conditions,
      handleChangeCondition,
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
              onClick={ () => handleChangeCondition(item) }
            >
              {item}
            </div>
          })
        }
      </div>
    )
  }
}
