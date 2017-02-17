import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

export default class HeaderItemFilter extends Component {

  static propTypes = {
    caption: PropTypes.string,
    openItemFilter: PropTypes.func,
    openedItemFilter: PropTypes.bool,
  }

  render() {
    const {
      caption,
      openItemFilter,
      openedItemFilter,
    } = this.props
    return (
      <div
        className="item-filter"
        onClick={openItemFilter}
      >
        <div className={cx({ 'arrow-open': openedItemFilter}, 'arrow-filter')}></div>
        <p>{caption}</p>
        <div className="reset-filter">Reset</div>
      </div>
    )
  }
}
