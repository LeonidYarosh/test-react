import React, {Component} from 'react'
import FilterPanel from '../components/FiltrationPanelView'
import Content from '../components/Content'
import itemsMock from '../mock/items.json'
import fieldsMock from '../mock/fields.json'
import {formatingItems, formatingFields} from '../util/formatingDataContent'
import update from 'react-addons-update'
import {FiltrationFunction as textFilter, conditions as textConditions} from '../components/FiltrationPanelView/TextFilter'
import {FiltrationFunction as dateFilter, conditions as dateConditions} from '../components/FiltrationPanelView/DateFilter'
import {FiltrationFunction as enumFilter, conditions as numberConditions} from '../components/FiltrationPanelView/EnumFilter'
import {FiltrationFunction as numberFilter, conditions as enumConditions} from '../components/FiltrationPanelView/NumberFilter'
import _ from 'lodash'

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
    storedFields: [],
  }

  reloadData = () => {
    const items = formatingItems(itemsMock.items)
    const fields = formatingFields(fieldsMock.fields, FILTERS)
    const storedFields = [...fields]
    this.setState({
      items,
      filteredItems: items,
      fields,
      storedFields,
    })
  }

  componentDidMount() {
    this.reloadData()
  }

  onChangeFilter = (index, condition) => {
    const fields = update(this.state.fields, {
      [index]: {condition: {$set: condition}},
    })
    const showApply = !_.isEqual(fields, this.state.storedFields)
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
    const storedFields = [...this.state.fields]
    this.setState({
      filteredItems,
      storedFields,
      showApply: false,
    })
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
