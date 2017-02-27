import React, {Component, PropTypes} from 'react'
import moment from 'moment'
import cx from 'classnames'

export default class ApplyFilter extends Component {

  static propTypes = {
    changeFilter: PropTypes.bool,
    filterData: PropTypes.func,
    correctDateInput: PropTypes.bool,
  }

  render() {
    return (
      <div className={cx({'show-block': this.props.changeFilter}, 'apply-button-box')}>
        <button
          className="apply-button"
          onClick={this.props.filterData}
        >
          Apply
        </button>
      </div>
    )
  }
}
