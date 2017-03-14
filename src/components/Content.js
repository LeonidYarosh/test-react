import React, {Component, PropTypes} from 'react'
import {
  AutoSizer,
  ScrollSync,
  Grid,
} from 'react-virtualized'
import 'react-virtualized/styles.css'
import scrollbarSize from 'dom-helpers/util/scrollbarSize'

export default class Content extends Component {

  static propTypes = {
    fields: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
  }

  state = {
    columnWidth: 100,
    heightS: 300,
    overscanColumnCount: 0,
    overscanRowCount: 5,
    rowHeight: 65,
  }

  _renderRightLastHeaderCell = ({columnIndex, key, rowIndex, style}) => {
    const {fields} = this.props
    let header = ''
    if (fields[fields.length - 1] !== undefined) {
      header = fields[fields.length - 1].caption
      return (
        <div
          className='headerCell'
          key={key}
          style={style}
        >
          {header || '---'}
        </div>
      )
    }
    return []
  }

  _renderLastSideCell = ({columnIndex, key, rowIndex, style}) => {
    const {
      items,
      fields,
    } = this.props
    if (items[rowIndex] !== undefined && fields[columnIndex] !== undefined && columnIndex < 1) {
      const nameFieldItem = fields[fields.length - 1].name
      const fieldItem = items[rowIndex][nameFieldItem]
      return (
        <div
          className='cell'
          key={key}
          style={style}
        >
          {fieldItem || '---'}
        </div>
      )
    }
    return []
  }

  _renderHeaderCell = ({columnIndex, key, rowIndex, style}) => {
    return columnIndex ? this._renderLeftHeaderCell({columnIndex, key, rowIndex, style}) : null
  }

  _renderLeftHeaderCell = ({columnIndex, key, rowIndex, style}) => {
    const {fields} = this.props
    let header = ''
    if (fields[columnIndex] !== undefined) {
      if (columnIndex !== fields.length - 1) {
        header = fields[columnIndex].caption
        return (
          <div
            className='headerCell'
            key={key}
            style={style}
          >
            {header || '---'}
          </div>
        )
      }
    }
    return []
  }
  _renderBodyCell = ({columnIndex, key, rowIndex, style}) => {
    if (columnIndex < 1) {
      return
    }

    return this._renderLeftSideCell({columnIndex, key, rowIndex, style})
  }

  _renderLeftSideCell = ({columnIndex, key, rowIndex, style}) => {
    const {
      items,
      fields,
    } = this.props
    if (items[rowIndex] !== undefined && fields[columnIndex] !== undefined) {
      if (columnIndex !== fields.length - 1) {
        const nameFieldItem = fields[columnIndex].name
        const fieldItem = items[rowIndex][nameFieldItem]
        return (
          <div
            className='cell'
            key={key}
            style={style}
          >
            {fieldItem || '---'}
          </div>
        )
      }
    }
    return []
  }
  determineColumnWidth = ({index}) => {
    const {fields} = this.props
    return fields[index] !== undefined ? fields[index].width * 10 : this.state.columnWidth
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
      <div className="content">
        <AutoSizer>
          {({width, height}) => (
            <ScrollSync>
              {({clientHeight, clientWidth, onScroll, scrollHeight, scrollLeft, scrollTop, scrollWidth}) => {
                const heightLeftHeaderCell = scrollWidth > width ?
                  height - rowHeight - scrollbarSize() : height - rowHeight
                return (
                  <div
                    className="GridRow"
                    style={{
                      width,
                    }}
                  >
                    <div
                      className="LeftSideGridContainer"
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        color: '#000',
                        backgroundColor: '#a7a7a7',
                      }}
                    >
                      <Grid
                        cellRenderer={this._renderLeftHeaderCell}
                        className="HeaderGrid"
                        width={columnWidthFirstColumn}
                        height={rowHeight}
                        rowHeight={rowHeight}
                        columnWidth={columnWidthFirstColumn}
                        rowCount={ fields.length ? 1 : 0 }
                        columnCount={1}
                      />
                    </div>
                    <div
                      className="LeftSideGridContainer"
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: rowHeight,
                        color: '#000',
                        backgroundColor: '#a7a7a7',
                      }}
                    >
                      <Grid
                        overscanColumnCount={overscanColumnCount}
                        overscanRowCount={overscanRowCount}
                        cellRenderer={this._renderLeftSideCell}
                        columnWidth={columnWidthFirstColumn}
                        columnCount={1}
                        className="LeftSideGrid"
                        height={heightLeftHeaderCell}
                        rowHeight={rowHeight}
                        rowCount={items.length}
                        scrollTop={scrollTop}
                        width={columnWidthFirstColumn}
                      />
                    </div>
                    <div className="GridColumn">
                      <div>
                        <div style={{
                          backgroundColor: '#fff',
                          color: 'black',
                          height: rowHeight,
                          width: width - scrollbarSize(),
                        }}>
                          <Grid
                            className="HeaderGrid"
                            columnWidth={this.determineColumnWidth}
                            columnCount={fields.length}
                            height={rowHeight}
                            overscanColumnCount={overscanColumnCount}
                            cellRenderer={this._renderHeaderCell}
                            rowHeight={rowHeight}
                            rowCount={1}
                            scrollLeft={scrollLeft}
                            width={width - scrollbarSize()}
                          />
                        </div>
                        <div
                          style={{
                            backgroundColor: '#fff',
                            color: '#000',
                            height: height - rowHeight,
                            width,
                          }}
                        >
                          <Grid
                            className="BodyGrid"
                            columnWidth={this.determineColumnWidth}
                            columnCount={fields.length}
                            height={height - rowHeight}
                            onScroll={onScroll}
                            overscanColumnCount={overscanColumnCount}
                            overscanRowCount={overscanRowCount}
                            cellRenderer={this._renderBodyCell}
                            rowHeight={rowHeight}
                            rowCount={items.length}
                            width={width}
                          />
                        </div>
                      </div>
                    </div>

                    <div
                      className="LeftSideGridContainer"
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        color: '#000',
                        backgroundColor: '#a7a7a7',
                      }}
                    >
                      <Grid
                        cellRenderer={this._renderRightLastHeaderCell}
                        className="HeaderGrid"
                        width={columnWidthFirstColumn + scrollbarSize()}
                        height={rowHeight}
                        rowHeight={rowHeight}
                        columnWidth={columnWidthFirstColumn + scrollbarSize()}
                        rowCount={ fields.length ? 1 : 0 }
                        columnCount={1}
                      />
                    </div>
                    <div
                      className="LeftSideGridContainer"
                      style={{
                        position: 'absolute',
                        right: 0 + scrollbarSize(),
                        top: rowHeight,
                        color: '#000',
                        backgroundColor: '#a7a7a7',
                      }}
                    >
                      <Grid
                        overscanColumnCount={overscanColumnCount}
                        overscanRowCount={overscanRowCount}
                        cellRenderer={this._renderLastSideCell}
                        columnWidth={columnWidthFirstColumn}
                        columnCount={1}
                        className="LeftSideGrid"
                        height={heightLeftHeaderCell}
                        rowHeight={rowHeight}
                        rowCount={items.length}
                        scrollTop={scrollTop}
                        width={columnWidthFirstColumn}
                      />
                    </div>

                  </div>
                )
              }}
            </ScrollSync>
          )}
        </AutoSizer>
      </div>
    )
  }
}
