import React, {Component, PropTypes} from 'react'
import GridLayout, {RenderCell} from '../BaseLayout'
import scrollbarSize from 'dom-helpers/util/scrollbarSize'
import cx from 'classnames'
import './style.sass'

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
  }

  renderBodyHeaderCell = ({columnIndex, key, style}) => {
    const {fields} = this.props
    if (fields[columnIndex] !== undefined && columnIndex && columnIndex !== fields.length - 1) {
      const header = fields[columnIndex].caption
      return (
        <RenderCell
          classNameCell='headerCell'
          key={key}
          style={style}
          text={header}
        />
      )
    }
    return []
  }

  renderBodyCell = ({columnIndex, key, rowIndex, style}) => {
    const {
      items,
      fields,
    } = this.props
    if (items[rowIndex] !== undefined &&
      fields[columnIndex] !== undefined && columnIndex && columnIndex !== fields.length - 1) {
      const nameFieldItem = fields[columnIndex].name
      const fieldItem = items[rowIndex][nameFieldItem]
      return (
        <RenderCell
          classNameCell='cell'
          key={key}
          style={style}
          text={fieldItem}
        />
      )
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

    const classNameWrapperGrid = 'GridBodyDiv'
    const classNameGridHeader = 'HeaderGrid'
    const classNameGridColumn = 'BodyGrid'
    const rowCountCell = fields.length ? 1 : 0

    return (
      <div className={cx('GridColumn')}>
        <div>
          <GridLayout
            classNameWrapperGrid={classNameWrapperGrid}
            styleWrapperGrid={styleBodyHeader}
            cellRenderer={this.renderBodyHeaderCell}
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
            classNameWrapperGrid={classNameWrapperGrid}
            styleWrapperGrid={styleBodyColumn}
            cellRenderer={this.renderBodyCell}
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
