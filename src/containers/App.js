import React, {Component} from 'react'
import FilterPanel from '../components/filterPanel/FilterPanel'
import Content from '../components/Content/Content'
import itemsMock from '../mock/items.json'
import fieldsMock from '../mock/fields.json'
import {
  formatingItems,
  formatingFields,
} from '../util/formatingDataContent'
import update from 'react-addons-update'
import {textFilter} from '../components/filterPanel/TextBodyFilterItem'
import {dateFilter} from '../components/filterPanel/DateBodyFilterItem'
import {enumFilter} from '../components/filterPanel/EnumBodyFilterItem'
import {numberFilter} from '../components/filterPanel/NumberBodyFilterItem'
import {conditions as textConditions} from '../components/filterPanel/TextBodyFilterItem'
import {conditions as dateConditions} from '../components/filterPanel/DateBodyFilterItem'
import {conditions as numberConditions} from '../components/filterPanel/NumberBodyFilterItem'
import {conditions as enumConditions} from '../components/filterPanel/EnumBodyFilterItem'

const FILTERS = {
  text: {
    typesCondition: textConditions,
    functionFilter: textFilter,
  },
  date: {
    typesCondition: dateConditions,
    functionFilter: dateFilter,
  },
  number: {
    typesCondition: numberConditions,
    functionFilter: numberFilter,
  },
  enum: {
    typesCondition: enumConditions,
    functionFilter: enumFilter,
  },
}

export default class App extends Component {

  state = {
    fields: [],
    items: [],
    filteredItems: [],
    showApply: false,
  }

  reloadData = () => {
    const items = formatingItems(itemsMock.items)
    const fields = formatingFields(fieldsMock.fields, FILTERS)
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
      if (field.condition.value !== '' && field.type === 'enum') {
        console.log('1')
      }
      if (field.condition.value !== '' && (field.type === 'text' || field.type === 'number')) {
        filteredItems = FILTERS[field.type].functionFilter(field.condition, filteredItems, field.name)
      }
      if (field.type === 'date' &&
        (field.condition.value.from !== '' || field.condition.value.to !== '')) {
        filteredItems = FILTERS[field.type].functionFilter(field.condition, filteredItems)
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
        />
        <Content
          fields={fields}
          items={filteredItems}
        />
      </div>
    )
  }
}
