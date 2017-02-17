import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

export default class ApplyFilter extends Component {

  static propTypes = {
    changeFilter: PropTypes.bool,
    filterData: PropTypes.func,
  }

  render() {
    return (
      <button
        className={cx({'show-block': this.props.changeFilter}, 'apply-button')}
        onClick={this.props.filterData}
      >
        Apply
      </button>
    )
  }
}
