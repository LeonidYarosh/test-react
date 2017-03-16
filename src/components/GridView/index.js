import React, {Component, PropTypes} from 'react'
import {
  AutoSizer,
  ScrollSync,
} from 'react-virtualized'
import 'react-virtualized/styles.css'
import scrollbarSize from 'dom-helpers/util/scrollbarSize'
import cx from 'classnames'
import SidePanelGrids from './SidePanel'
import BodyColumnsGrids from './Body'
import './style.sass'

class WrapperGridRow extends Component {

  static propTypes = {
    fields: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    children: PropTypes.array.isRequired,
  }

  render() {
    const {
      children,
      fields,
      width,
    } = this.props
    if (fields.length) {
      const GridsRow = React.Children.map(children, child =>
        React.cloneElement(child, {...this.props})
      )
      return (
        <div
          className={cx('GridRow')}
          style={{width}}
        >
          {GridsRow}
        </div>
      )
    }
    return null
  }
}

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

    const columnWidthFirstColumn = fields.length ? fields[0].width * 10 : columnWidth

    return (
      <div className={cx('content')}>
        <AutoSizer>
          {({width, height}) =>
            <ScrollSync>
              {({onScroll, scrollLeft, scrollTop, scrollWidth}) => {
                const heightLeftHeaderCell = scrollWidth > width ?
                  height - rowHeight - scrollbarSize() : height - rowHeight
                return (
                  <WrapperGridRow
                    fields={fields}
                    items={items}
                    widthSide={columnWidthFirstColumn}
                    heightCell={rowHeight}
                    heightSide={heightLeftHeaderCell}
                    rowHeight={rowHeight}
                    overscanColumnCount={overscanColumnCount}
                    overscanRowCount={overscanRowCount}
                    scrollTop={scrollTop}
                    width={width}
                  >
                    <SidePanelGrids
                      orientation="left"
                    />
                    <BodyColumnsGrids
                      styleBodyHeader={{
                        height: rowHeight,
                        width: width - scrollbarSize(),
                      }}
                      styleBodyColumn={{
                        height: height - rowHeight,
                        width,
                      }}
                      height={height}
                      rowHeight={rowHeight}
                      scrollLeft={scrollLeft}
                      onScroll={onScroll}
                    />
                    <SidePanelGrids
                      orientation="right"
                    />
                  </WrapperGridRow>
                )
              }}
            </ScrollSync>
          }
        </AutoSizer>
      </div>
    )
  }
}
