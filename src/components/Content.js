import React, {Component, PropTypes} from 'react'
import {AutoSizer, Table, Column} from 'react-virtualized'
import 'react-virtualized/styles.css'

export default class Content extends Component {

  static propTypes = {
    fields: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
  }

  render() {
    const {
      items,
      fields,
    } = this.props
    return (
      <div className="content">
        <AutoSizer>
          {({width, height}) => {
            return (
              <Table
                width={width}
                height={height}
                headerHeight={60}
                rowHeight={65}
                rowCount={items.length}
                rowGetter={({index}) => items[index]}
              >
                {
                  fields.map(field => {
                    const {name, caption} = field
                    return (
                      <Column
                        label={caption}
                        dataKey={name}
                        width={100}
                        key={caption}
                        flexGrow={1}
                      />
                    )
                  })
                }
              </Table>
            )
          }}
        </AutoSizer>
      </div>
    )
  }
}
