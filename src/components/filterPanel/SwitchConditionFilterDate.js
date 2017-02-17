import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

const condition = [
  'equals',
  'before',
  'after',
  'between',
]

export default class SwitchConditionFilterDate extends Component {

  static propTypes = {}
  // Переписать вверху
  state = {
    active: 'equals',
  }

  handleClickCondition = (item) => {
    this.setState({
      active: item,
    })
  }

  render() {
    const {
      active,
    } = this.state

    return (
      <div className="condition-filter-date">
        <p>Condition:</p>
        {
          condition.map((item, i) => {
            return <div
              className={cx({'active-condition': item === active}, 'item-condition')}
              key={i}
              onClick={ () => this.handleClickCondition(item) }
            >
              {item}
            </div>
          })
        }
      </div>
    )
  }
}
