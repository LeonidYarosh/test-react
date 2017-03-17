import React, {Component, PropTypes} from 'react'
import {AutoSizer} from 'react-virtualized'
import 'react-virtualized/styles.css'
import cx from 'classnames'
import GridView from './GridView'
import './style.sass'

export default class Content extends Component {
  static propTypes = {
    fields: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
  }
  state = {
    columnWidth: 100,
    overscanColumnCount: 0,
    overscanRowCount: 5,
    rowHeight: 65,
  }
  render() {
    const {
      items,
      fields,
    } = this.props
    const {
      columnWidth,
      overscanColumnCount,
      overscanRowCount,
      rowHeight,
    } = this.state
    const GridColumnWidth = fields.length ? fields[0].width * 10 : columnWidth
    return (
      <div className={cx('content')}>
        <AutoSizer>
          {({width, height}) =>
            <GridView
              fields={fields}
              items={items}
              width={width}
              height={height}
              overscanColumnCount={overscanColumnCount}
              overscanRowCount={overscanRowCount}
              rowHeight={rowHeight}
              GridColumnWidth={GridColumnWidth}
            />
          }
        </AutoSizer>
      </div>
    )
  }
}
