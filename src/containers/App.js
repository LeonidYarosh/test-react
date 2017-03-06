import React, {Component} from 'react'
import FilterPanel from '../components/filterPanel/FilterPanel'
import Content from '../components/Content'
import itemsMock from '../mock/items.json'
import fields from '../mock/fields.json'
import {
  formatingItems,
  inputFieldCollectionName,
  formattingDate,
} from '../util/formatingDataContent'
import moment from 'moment'
import _ from 'lodash'

const conditions = [
  'equals',
  'before',
  'after',
  'between',
]

export default class App extends Component {

  state = {
    dateFilterCollection: {
      dateFilter: '',
      fromDateFilter: '',
      toDateFilter: '',
    },
    inputFieldCollection: {},
    nameFilterInput: '',
    valueFilterInput: '',
    filterChanged: false,
    items: [],
    filteredItems: [],
    activeConditionDate: conditions[0],
  }

  reloadData = () => {
    const items = formatingItems(itemsMock)
    const inputFieldCollection = inputFieldCollectionName(fields.fields)
    this.setState({
      items,
      filteredItems: items,
      inputFieldCollection,
    })
  }

  checkDateFilter = (dateFilter, fromDateFilter, toDateFilter) => {
    return dateFilter !== '' || fromDateFilter !== '' ||
      toDateFilter !== ''
  }

  checkAllInputFilterCollection = () => {
    const {inputFieldCollection} = this.state
    let checkFullInput = false
    for (const i in inputFieldCollection) {
      if (inputFieldCollection[i].value !== '') {
        checkFullInput = true
      }
    }
    return checkFullInput
  }

  checkVoidAllFilter = (dateFilter, fromDateFilter, toDateFilter) => {
    const checkFullInput = this.checkAllInputFilterCollection()
    const checkFullDate = this.checkDateFilter(dateFilter, fromDateFilter, toDateFilter)
    return checkFullDate || checkFullInput
  }

  componentDidMount() {
    this.reloadData()
  }

  switchCoditionFilterDate = (dayItem, selectedDay, selectedFromDay, selectedToDay) => {
    switch (this.state.activeConditionDate) {
      case 'equals': {
        return dayItem === formattingDate(selectedDay)
      }
      case 'before': {
        return moment(dayItem).isBefore(selectedDay)
      }
      case 'after': {
        return moment(dayItem).isAfter(selectedDay)
      }
      case 'between': {
        return moment(dayItem).isBetween(selectedFromDay, selectedToDay)
      }
      default: {
        return dayItem === formattingDate(selectedDay)
      }
    }
  }

  newFilteredData = () => {
    const {
      dateFilterCollection,
      items,
    } = this.state
    if (dateFilterCollection.dateFilter !== '' ||
      dateFilterCollection.fromDateFilter !== '' ||
      dateFilterCollection.toDateFilter !== '') {
      const selectedDay = formattingDate(dateFilterCollection.dateFilter)
      const selectedFromDay = formattingDate(dateFilterCollection.fromDateFilter)
      const selectedToDay = formattingDate(dateFilterCollection.toDateFilter)
      return items.filter(item => {
        const dayItem = formattingDate(item['Date Submitted'])
        return this.switchCoditionFilterDate(dayItem, selectedDay, selectedFromDay, selectedToDay)
      })
    }
    return items
  }

  checkValidDate = (item) => {
    if (moment(this.state.dateFilterCollection.dateFilter).isValid() && item !== 'between') {
      this.setState({
        filterChanged: true,
      })
    }
    if (item === 'between') {
      this.setState({
        filterChanged: false,
      })
    }
  }

  handleChangeCondition = (item) => {
    this.setState({
      activeConditionDate: item,
    }, this.checkValidDate(item))
  }

  changeDate = (field, dateFilterValue) => {
    const {
      dateFilterCollection,
      items,
      filteredItems,
    } = this.state
    const filterChanged = this.checkVoidAllFilter(
      field === 'dateFilter' ? dateFilterValue : dateFilterCollection.dateFilter,
      field === 'fromDateFilter' ? dateFilterValue : dateFilterCollection.fromDateFilter,
      field === 'toDateFilter' ? dateFilterValue : dateFilterCollection.toDateFilter,
    )
    this.setState({
      dateFilterCollection: {
        ...dateFilterCollection,
        [field]: dateFilterValue,
      },
      filteredItems: dateFilterValue === '' ? items : filteredItems,
      filterChanged,
    })
  }

  resetFilterDate = () => {
    const filterChanged = this.checkVoidAllFilter('', '', '')
    this.setState({
      dateFilterCollection: {
        dateFilter: '',
        fromDateFilter: '',
        toDateFilter: '',
      },
      filteredItems: this.state.items,
      filterChanged,
    })
  }

  checkInputFilterCollectionExceptOne = (name) => {
    const {
      inputFieldCollection,
    } = this.state

    for (const i in inputFieldCollection) {
      if (inputFieldCollection[i].name !== name && inputFieldCollection[i].value !== '') {
        return true
      }
    }
  }

  resetFilterInput = (name) => {
    const {
      dateFilterCollection,
      items,
      inputFieldCollection,
    } = this.state
    const checkFullInputFilterCollection = this.checkInputFilterCollectionExceptOne(name)
    const checkFullDateFilterCollection = this.checkDateFilter(
      dateFilterCollection.dateFilter,
      dateFilterCollection.fromDateFilter,
      dateFilterCollection.toDateFilter)
    this.setState({
      inputFieldCollection: {
        ...inputFieldCollection,
        [name]: {
          ...inputFieldCollection[name],
          value: '',
        },
      },
      filterChanged: checkFullInputFilterCollection || checkFullDateFilterCollection,
      filteredItems: items,
    })
  }

  filterForInput = (filteredItems) => {
    const {inputFieldCollection} = this.state
    let newFilterItems = filteredItems
    for (const i in inputFieldCollection) {
      if (inputFieldCollection[i].value !== '') {
        const el = inputFieldCollection[i]
        newFilterItems = newFilterItems.filter(item => {
          const itemStr = item[el.name].toLowerCase()
          return _.includes(itemStr, el.value)
        })
      }
    }
    return newFilterItems
  }

  filterData = () => {
    let filteredItems = this.newFilteredData()
    filteredItems = this.filterForInput(filteredItems)

    this.setState({
      filteredItems,
      filterChanged: false,
    })
  }

  changeInputFilter = (nameFilterInput, valueFilterInput) => {
    const {
      inputFieldCollection,
      items,
      filteredItems,
    } = this.state
    const filterChanged = valueFilterInput !== ''
    this.setState({
      inputFieldCollection: {
        ...inputFieldCollection,
        [nameFilterInput]: {
          ...inputFieldCollection[nameFilterInput],
          value: valueFilterInput,
        },
      },
      filteredItems: valueFilterInput === '' ? items : filteredItems,
      filterChanged,
    })
  }

  render() {
    const {
      filteredItems,
      activeConditionDate,
      filterChanged,
    } = this.state

    return (
      <div>
        <FilterPanel
          fields={fields.fields}
          filterChanged={filterChanged}
          changeDate={this.changeDate}
          changeInputFilter={this.changeInputFilter}
          filterData={this.filterData}
          conditions={conditions}
          handleChangeCondition={this.handleChangeCondition}
          activeConditionDate={activeConditionDate}
          resetFilterDate={this.resetFilterDate}
          resetFilterInput={this.resetFilterInput}
        />
        <Content
          fields={fields.fields}
          items={filteredItems}
        />
      </div>
    )
  }
}
