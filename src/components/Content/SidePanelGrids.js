import React, {Component, PropTypes} from 'react'
import GridLayout, {cellLayout} from './GridLayout'
import scrollbarSize from 'dom-helpers/util/scrollbarSize'

export default class SidePanelGrids extends Component {

  static propTypes = {
    fields: PropTypes.array,
    items: PropTypes.array,
    orientation: PropTypes.string.isRequired,
    widthSide: PropTypes.number,
    heightCell: PropTypes.number,
    heightSide: PropTypes.number,
    rowHeight: PropTypes.number,
    overscanColumnCount: PropTypes.number,
    overscanRowCount: PropTypes.number,
    scrollTop: PropTypes.number,
  }

  static defaultProps = {
    fields: [],
    items: [],
    widthSide: 0,
    heightCell: 0,
    heightSide: 0,
    rowHeight: 0,
    overscanColumnCount: 10,
    overscanRowCount: 10,
    scrollTop: 10,
  }

  _renderHeaderCell = ({key, style}) => {
    const {fields, orientation} = this.props
    const index = orientation === 'left' ? 0 : fields.length - 1
    if (fields[index] !== undefined) {
      const header = fields[index].caption
      return cellLayout('headerCell', key, style, header)
    }
    return []
  }

  _renderSideCell = ({rowIndex, key, style}) => {
    const {
      items,
      fields,
      orientation,
    } = this.props
    const columnIndex = orientation === 'left' ? 0 : fields.length - 1
    if (items[rowIndex] !== undefined && fields[columnIndex] !== undefined) {
      const nameFieldItem = fields[columnIndex].name
      const fieldItem = items[rowIndex][nameFieldItem]
      return cellLayout('cell', key, style, fieldItem)
    }
    return []
  }

  render() {
    const {
      fields,
      items,
      orientation,
      widthSide,
      heightCell,
      heightSide,
      rowHeight,
      overscanColumnCount,
      overscanRowCount,
      scrollTop,
    } = this.props

    const classNameGridCell = 'HeaderGrid'
    const classNameGridSide = 'LeftSideGrid'
    const classNameDivGrid = 'SideGridContainer'
    const columnCount = 1
    const styleHeaderLeft = {
      left: 0,
      top: 0,
    }
    const styleSideLeft = {
      left: 0,
      top: rowHeight,
    }
    const styleHeaderRight = {
      right: 0,
      top: 0,
    }
    const styleSideRight = {
      right: 0 + scrollbarSize(),
      top: rowHeight,
    }

    const styleHeader = orientation === 'left' ? styleHeaderLeft : styleHeaderRight
    const styleSide = orientation === 'left' ? styleSideLeft : styleSideRight
    const widthCell = orientation === 'left' ? widthSide : widthSide + scrollbarSize()
    const rowCountCell = fields.length ? 1 : 0
    const rowCountSide = items.length

    return (
      <div>
        <GridLayout
          classNameDivGrid={classNameDivGrid}
          styleDivGrid={styleHeader}
          cellRenderer={this._renderHeaderCell}
          classNameGrid={classNameGridCell}
          width={widthCell}
          height={heightCell}
          rowHeight={rowHeight}
          columnWidth={widthCell}
          rowCount={rowCountCell}
          columnCount={columnCount}
        />
        <GridLayout
          classNameDivGrid={classNameDivGrid}
          styleDivGrid={styleSide}
          cellRenderer={this._renderSideCell}
          classNameGrid={classNameGridSide}
          width={widthSide}
          height={heightSide}
          rowHeight={rowHeight}
          columnWidth={widthSide}
          rowCount={rowCountSide}
          columnCount={columnCount}
          overscanColumnCount={overscanColumnCount}
          overscanRowCount={overscanRowCount}
          scrollTop={scrollTop}
        />
      </div>
    )
  }
}
