import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

export default class ApplyFilter extends Component {

  static propTypes = {
    filterChanged: PropTypes.bool,
    filterData: PropTypes.func,
  }

  render() {
    return (
      <div className={cx({'show-block': this.props.filterChanged}, 'apply-button-box')}>
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
