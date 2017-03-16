import React, {Component, PropTypes} from 'react'
import HeaderItemFilter from './HeaderItemFilter'
import cx from 'classnames'
import './style.sass'

export default class ItemFilter extends Component {

  state = {
    openedItemFilter: false,
  }

  static propTypes = {
    caption: PropTypes.string,
    children: PropTypes.node,
  }

  openItemFilter = () => {
    this.setState({
      openedItemFilter: !this.state.openedItemFilter,
    })
  }

  render() {
    const {
      caption,
    } = this.props
    return (
      <div className={cx('group-filter')}>
        <HeaderItemFilter
          caption={caption}
          openItemFilter={this.openItemFilter}
          openedItemFilter={this.state.openedItemFilter}
        />
        <div className={cx({ 'show-block': this.state.openedItemFilter}, 'body-item-filter')}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
