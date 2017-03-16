import React, {Component} from 'react'

export const conditions = [
  'equals',
  'notEquals',
]

export function enumFilter(condition, items) {
  console.log('enum', condition, items)
}

export default class EnumBodyItemFilter extends Component {

  render() {
    return (
      <p>Enum</p>
    )
  }
}
