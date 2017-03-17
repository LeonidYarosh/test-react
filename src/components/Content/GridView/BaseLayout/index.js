import React, {Component, PropTypes} from 'react'
import { Grid } from 'react-virtualized'
import cx from 'classnames'
import 'react-virtualized/styles.css'
import './style.sass'

export function RenderCell({classNameCell, style, text = '---'}) {
  return (
    <div
      className={cx(classNameCell)}
      style={style}
    >
      {text}
    </div>
  )
}

RenderCell.propTypes = {
  classNameCell: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
}

export default class GridLayout extends Component {

  static propTypes = {
    classNameWrapperGrid: PropTypes.string.isRequired,
    styleWrapperGrid: PropTypes.object.isRequired,
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
    scrollTop: 0,
    scrollLeft: 0,
  }

  render() {
    const {
      classNameWrapperGrid,
      styleWrapperGrid,
      classNameGrid,
    } = this.props

    return (
      <div
        className={cx(classNameWrapperGrid)}
        style={styleWrapperGrid}
      >
        <Grid
          {...this.props}
          className={cx(classNameGrid)}
        />
      </div>
    )
  }
}
