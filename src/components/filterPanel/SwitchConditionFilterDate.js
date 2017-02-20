import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

export default class SwitchConditionFilterDate extends Component {

  static propTypes = {
    condition: PropTypes.array.isRequired,
    handleChangeCondition: PropTypes.func,
    activeConditionDate: PropTypes.string,
  }

  render() {
    const {
      condition,
      handleChangeCondition,
      activeConditionDate,
    } = this.props
    return (
      <div className="condition-filter-date">
        <p>Condition:</p>
        {
          condition.map((item, i) => {
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
