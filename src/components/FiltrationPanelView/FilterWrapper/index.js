import React, {Component, PropTypes} from 'react'
import FilterHeader from './FilterHeader'
import cx from 'classnames'
import './style.sass'

export default class FilterWrapper extends Component {

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
        <FilterHeader
          caption={caption}
          openItemFilter={this.openItemFilter}
          openedItemFilter={this.state.openedItemFilter}
        />
        <div className={cx({'show-block': this.state.openedItemFilter}, 'body-item-filter')}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
