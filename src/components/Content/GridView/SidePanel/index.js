import React, {Component, PropTypes} from 'react'
import GridLayout, {RenderCell} from '../BaseLayout'
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
    scrollTop: 10,
  }

  renderHeaderCell = ({key, style}) => {
    const {fields, orientation} = this.props
    const index = orientation === 'left' ? 0 : fields.length - 1
    if (fields[index] !== undefined) {
      const header = fields[index].caption
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

  renderSideCell = ({rowIndex, key, style}) => {
    const {
      items,
      fields,
      orientation,
    } = this.props
    const columnIndex = orientation === 'left' ? 0 : fields.length - 1
    if (items[rowIndex] !== undefined && fields[columnIndex] !== undefined) {
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
    const classNameWrapperGrid = 'SideGridContainer'
    const columnCount = 1
    const styleHeader = {
      [orientation]: 0,
      top: 0,
    }
    const styleSide = {
      [orientation]: orientation === 'right' ? scrollbarSize() : 0,
      top: rowHeight,
    }
    const widthCell = orientation === 'right' ? widthSide + scrollbarSize() : widthSide
    const rowCountCell = fields.length ? 1 : 0
    const rowCountSide = items.length

    return (
      <div>
        <GridLayout
          classNameWrapperGrid={classNameWrapperGrid}
          styleWrapperGrid={styleHeader}
          cellRenderer={this.renderHeaderCell}
          classNameGrid={classNameGridCell}
          width={widthCell}
          height={heightCell}
          rowHeight={rowHeight}
          columnWidth={widthCell}
          rowCount={rowCountCell}
          columnCount={columnCount}
        />
        <GridLayout
          classNameWrapperGrid={classNameWrapperGrid}
          styleWrapperGrid={styleSide}
          cellRenderer={this.renderSideCell}
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
