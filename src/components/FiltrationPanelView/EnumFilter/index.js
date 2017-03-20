import React, {Component} from 'react'

export const conditions = [
  'equals',
  'notEquals',
]

export function FiltrationFunction(condition, items) {
  console.log('enum', condition, items)
}

export default class EnumFilter extends Component {

  render() {
    return (
      <p>Enum</p>
    )
  }
}
