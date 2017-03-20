import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import './style.sass'

export default class FilterHeader extends Component {

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
        className={cx({'active-item-filter': this.props.openedItemFilter}, 'item-filter')}
        onClick={openItemFilter}
      >
        <div className={cx({ 'arrow-open': openedItemFilter}, 'arrow-filter')}></div>
        <p>{caption}</p>
        <div className={cx('reset-filter')}>Reset</div>
      </div>
    )
  }
}
