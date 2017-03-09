import React, {Component} from 'react'
import FilterPanel from '../components/filterPanel/FilterPanel'
import Content from '../components/Content'
import itemsMock from '../mock/items.json'
import fieldsMock from '../mock/fields.json'
import {
  formatingItems,
  formatingFields,
} from '../util/formatingDataContent'
import update from 'react-addons-update'
import {textFilter} from '../components/filterPanel/TextBodyFilterItem'
import {dateFilter} from '../components/filterPanel/DateBodyItemFilter'
import {enumFilter} from '../components/filterPanel/EnumBodyItemFilter'
import {numberFilter} from '../components/filterPanel/NumberBodyItemFilter'

const conditions = {
  number: [
    'equals',
    'notEquals',
    'less',
    'better',
  ],
  text: [
    'contain',
    'equals',
    'notEquals',
  ],
  enum: [
    'equals',
    'notEquals',
  ],
  date: [
    'equals',
    'before',
    'after',
    'between',
  ],
}

const FILTER_FUNC = {
  text: textFilter,
  date: dateFilter,
  enum: enumFilter,
  number: numberFilter,
}

export default class App extends Component {

  state = {
    fields: [],
    items: [],
    filteredItems: [],
    showApply: false,
    nameFilterInput: '',
    valueFilterInput: '',
    activeConditionDate: conditions[0],
  }

  reloadData = () => {
    const items = formatingItems(itemsMock.items)
    const fields = formatingFields(fieldsMock.fields, conditions)
    this.setState({
      items,
      filteredItems: items,
      fields,
    })
  }

  componentDidMount() {
    this.reloadData()
  }

  checkValueForShowApply = (fields) => {
    let showApply = false
    fields.map(field => {
      if (field.condition.value !== '' && field.type !== 'date') {
        showApply = true
      }
      if (field.type === 'date' && (field.condition.value.from !== '' || field.condition.value.to !== '')) {
        showApply = true
      }
    })
    return showApply
  }

  onChangeFilter = (index, condition) => {
    const fields = update(this.state.fields, {
      [index]: {condition: {$set: condition}},
    })
    const showApply = this.checkValueForShowApply(fields)
    this.setState({
      fields,
      showApply,
    })
  }

  checkValueForStartFilterData = () => {
    const {items, fields} = this.state
    let filteredItems = [...items]

    fields.map(field => {
      if (field.condition.value !== '' && field.type !== 'date' && field.type !== 'text') {
        console.log('1')
      }
      if (field.condition.value !== '' && field.type === 'text') {
        filteredItems = FILTER_FUNC[field.type](field.condition, filteredItems, field.name)
      }
      if (field.type === 'date' &&
        (field.condition.value.from !== '' || field.condition.value.to !== '')) {
        filteredItems = FILTER_FUNC[field.type](field.condition, filteredItems)
      }
    })
    return filteredItems
  }

  onApply = () => {
    const filteredItems = this.checkValueForStartFilterData()
    this.setState({
      filteredItems,
      showApply: false,
    })
  }

  resetFilteredItems = () => {
    this.setState({filteredItems: this.state.items})
  }

  render() {
    const {
      filteredItems,
      fields,
      showApply,
    } = this.state

    return (
      <div>
        <FilterPanel
          fields={fields}
          onChangeFilter={this.onChangeFilter}
          onApply={this.onApply}
          showApply={showApply}
          resetFilteredItems={this.resetFilteredItems}
          conditions={conditions}
        />
        <Content
          fields={fields}
          items={filteredItems}
        />
      </div>
    )
  }
}
