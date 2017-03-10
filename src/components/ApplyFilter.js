import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

export default class ApplyFilter extends Component {

  static propTypes = {
    showApply: PropTypes.bool,
    onApply: PropTypes.func,
  }

  render() {
    const {
      showApply,
      onApply,
    } = this.props
    return (
      <div className={cx({'show-block': showApply}, 'apply-button-box')}>
        <button
          className="apply-button"
          onClick={onApply}
        >
          Apply
        </button>
      </div>
    )
  }
}
