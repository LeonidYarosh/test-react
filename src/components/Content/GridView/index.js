import React, {Component, PropTypes} from 'react'
import {ScrollSync} from 'react-virtualized'
import scrollbarSize from 'dom-helpers/util/scrollbarSize'
import cx from 'classnames'
import SidePanelGrids from './SidePanel'
import BodyColumnsGrids from './Body'
import 'react-virtualized/styles.css'
import './style.sass'

class WrapperGridView extends Component {

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

    const GridsRow = React.Children.map(children, child =>
      React.cloneElement(child, {...this.props})
    )
    return fields.length ?
      <div
        className={cx('GridRow')}
        style={{width}}
      >
        {GridsRow}
      </div>
    : null
  }
}

export default class GridView extends Component {

  static propTypes = {
    fields: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    overscanColumnCount: PropTypes.number.isRequired,
    overscanRowCount: PropTypes.number.isRequired,
    rowHeight: PropTypes.number.isRequired,
    GridColumnWidth: PropTypes.number.isRequired,
  }

  render() {
    const {
      items,
      fields,
      width,
      height,
      overscanColumnCount,
      overscanRowCount,
      rowHeight,
      GridColumnWidth,
    } = this.props

    return (
        <ScrollSync>
          {({onScroll, scrollLeft, scrollTop, scrollWidth}) => {
            const heightLeftHeaderCell = scrollWidth > width ?
              height - rowHeight - scrollbarSize() : height - rowHeight
            return (
              <WrapperGridView
                fields={fields}
                items={items}
                widthSide={GridColumnWidth}
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
              </WrapperGridView>
            )
          }}
        </ScrollSync>
    )
  }
}
