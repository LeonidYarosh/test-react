import React, {Component, PropTypes} from 'react'
import GridLayout, {cellLayout} from './GridLayout'
import scrollbarSize from 'dom-helpers/util/scrollbarSize'

export default class BodyColumnsGrids extends Component {

  static propTypes = {
    fields: PropTypes.array,
    items: PropTypes.array,
    styleBodyHeader: PropTypes.object.isRequired,
    styleBodyColumn: PropTypes.object.isRequired,
    width: PropTypes.number,
    height: PropTypes.number.isRequired,
    rowHeight: PropTypes.number.isRequired,
    overscanColumnCount: PropTypes.number,
    scrollLeft: PropTypes.number.isRequired,
    onScroll: PropTypes.func.isRequired,
  }

  static defaultProps = {
    fields: [],
    items: [],
    width: 0,
    overscanColumnCount: 10,
  }

  _renderBodyHeaderCell = ({columnIndex, key, style}) => {
    const {fields} = this.props
    if (fields[columnIndex] !== undefined && columnIndex && columnIndex !== fields.length - 1) {
      const header = fields[columnIndex].caption
      return cellLayout('headerCell', key, style, header)
    }
    return []
  }

  _renderBodyCell = ({columnIndex, key, rowIndex, style}) => {
    const {
      items,
      fields,
    } = this.props
    if (items[rowIndex] !== undefined &&
      fields[columnIndex] !== undefined && columnIndex && columnIndex !== fields.length - 1) {
      const nameFieldItem = fields[columnIndex].name
      const fieldItem = items[rowIndex][nameFieldItem]
      return cellLayout('cell', key, style, fieldItem)
    }
  }

  determineColumnWidth = ({index}) => {
    const {fields} = this.props
    return fields[index] !== undefined ? fields[index].width * 10 : this.state.columnWidth
  }

  render() {
    const {
      fields,
      items,
      styleBodyHeader,
      styleBodyColumn,
      width,
      height,
      rowHeight,
      overscanColumnCount,
      scrollLeft,
      onScroll,
    } = this.props

    const classNameDivGrid = 'GridBodyDiv'
    const classNameGridHeader = 'HeaderGrid'
    const classNameGridColumn = 'BodyGrid'
    const rowCountCell = fields.length ? 1 : 0

    return (
      <div className="GridColumn">
        <div>
          <GridLayout
            classNameDivGrid={classNameDivGrid}
            styleDivGrid={styleBodyHeader}
            cellRenderer={this._renderBodyHeaderCell}
            classNameGrid={classNameGridHeader}
            width={width - scrollbarSize()}
            height={rowHeight}
            rowHeight={rowHeight}
            columnWidth={this.determineColumnWidth}
            rowCount={rowCountCell}
            columnCount={fields.length}
            overscanColumnCount={overscanColumnCount}
            scrollLeft={scrollLeft}
          />
          <GridLayout
            classNameDivGrid={classNameDivGrid}
            styleDivGrid={styleBodyColumn}
            cellRenderer={this._renderBodyCell}
            classNameGrid={classNameGridColumn}
            width={width}
            height={height - rowHeight}
            rowHeight={rowHeight}
            columnWidth={this.determineColumnWidth}
            rowCount={items.length}
            columnCount={fields.length}
            onScroll={onScroll}
          />
        </div>
      </div>
    )
  }
}
