import React, {Component, PropTypes} from 'react'
import { Grid } from 'react-virtualized'
import cx from 'classnames'
import 'react-virtualized/styles.css'
import './style.sass'

export function cellLayout(classNameCell, key, style, text) {
  return (
    <div
      className={cx(classNameCell)}
      key={key}
      style={style}
    >
      {text || '---'}
    </div>
  )
}

export default class GridLayout extends Component {

  static propTypes = {
    classNameDivGrid: PropTypes.string.isRequired,
    styleDivGrid: PropTypes.object.isRequired,
    cellRenderer: PropTypes.func.isRequired,
    classNameGrid: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    rowHeight: PropTypes.number.isRequired,
    columnWidth: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.number,
    ]),
    rowCount: PropTypes.number.isRequired,
    columnCount: PropTypes.number.isRequired,
    overscanColumnCount: PropTypes.number,
    overscanRowCount: PropTypes.number,
    scrollTop: PropTypes.number,
    scrollLeft: PropTypes.number,
    onScroll: PropTypes.func,
  }

  static defaultProps = {
    overscanColumnCount: 10,
    overscanRowCount: 10,
    scrollTop: 0,
    scrollLeft: 0,
    onScroll: undefined,
  }

  render() {
    const {
      classNameDivGrid,
      styleDivGrid,
      cellRenderer,
      classNameGrid,
      width,
      height,
      rowHeight,
      columnWidth,
      rowCount,
      columnCount,
      overscanColumnCount,
      overscanRowCount,
      scrollTop,
      scrollLeft,
      onScroll,
    } = this.props

    return (
      <div
        className={cx(classNameDivGrid)}
        style={styleDivGrid}
      >
        <Grid
          cellRenderer={cellRenderer}
          className={cx(classNameGrid)}
          width={width}
          height={height}
          rowHeight={rowHeight}
          columnWidth={columnWidth}
          rowCount={ rowCount}
          columnCount={columnCount}
          overscanColumnCount={overscanColumnCount}
          overscanRowCount={overscanRowCount}
          scrollTop={scrollTop}
          scrollLeft={scrollLeft}
          onScroll={onScroll}
        />
      </div>
    )
  }
}
