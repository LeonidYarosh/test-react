import React, {Component} from 'react'

export const conditions = [
  'equals',
  'notEquals',
  'less',
  'better',
]

export function numberFilter(condition, items) {
  console.log('number', condition, items)
}

export default class NumberBodyItemFilter extends Component {

  render() {
    return (
      <p>Number</p>
    )
  }
}
