import React, {Component} from 'react'
import FilterPanel from '../components/filterPanel/FilterPanel'
import Content from '../components/Content'
import itemsMock from '../mock/items.json'
import fields from '../mock/fields.json'
import {formatingItems, inputFieldCollectionName} from '../util/formatingDataContent'
import moment from 'moment'
import _ from 'lodash'

const condition = [
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
    changeFilter: false,
    items: [],
    filterItems: [],
    activeConditionDate: 'equals',
  }

  reloadData = () => {
    const items = formatingItems(itemsMock)
    const inputFieldCollection = inputFieldCollectionName(fields.fields)
    this.setState({
      items,
      filterItems: items,
      inputFieldCollection,
    })
  }

  checkDateFilter = (dateFilter, fromDateFilter, toDateFilter) => {
    return dateFilter !== '' || fromDateFilter !== '' ||
      toDateFilter !== ''
  }

  checkAllInputFilterCollection = () => {
    let checkFullInput = false
    for (const i in this.state.inputFieldCollection) {
      if (this.state.inputFieldCollection[i].value !== '') {
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

  switchCoditionFilterDate = (item, dayItem, selectDay, selectFromDay, selectToDay) => {
    switch (this.state.activeConditionDate) {
      case 'equals': {
        return moment(item['Date Submitted']).format('L') === moment(selectDay).format('L')
      }
      case 'before': {
        return moment(dayItem).isBefore(selectDay)
      }
      case 'after': {
        return moment(dayItem).isAfter(selectDay)
      }
      case 'between': {
        return moment(dayItem).isBetween(selectFromDay, selectToDay)
      }
      default: {
        return moment(item['Date Submitted']).format('L') === moment(selectDay).format('L')
      }
    }
  }

  newFilteredData = () => {
    if (this.state.dateFilterCollection.dateFilter !== '' ||
      this.state.dateFilterCollection.fromDateFilter !== '' ||
      this.state.dateFilterCollection.toDateFilter !== '') {
      const selectDay = moment(this.state.dateFilterCollection.dateFilter).format('L')
      const selectFromDay = moment(this.state.dateFilterCollection.fromDateFilter).format('L')
      const selectToDay = moment(this.state.dateFilterCollection.toDateFilter).format('L')
      return this.state.items.filter(item => {
        const dayItem = moment(item['Date Submitted']).format('L')
        return this.switchCoditionFilterDate(item, dayItem, selectDay, selectFromDay, selectToDay)
      })
    }
    return this.state.items
  }

  checkValidDate = (item) => {
    if (moment(this.state.dateFilterCollection.dateFilter).isValid() && item !== 'between') {
      this.setState({
        changeFilter: true,
      })
    }
    if (item === 'between') {
      this.setState({
        changeFilter: false,
      })
    }
  }

  handleChangeCondition = (item) => {
    this.setState({
      activeConditionDate: item,
    }, this.checkValidDate(item))
  }

  changeDate = (field, dateFilterValue) => {
    const changeFilter = this.checkVoidAllFilter(
      field === 'dateFilter' ? dateFilterValue : this.state.dateFilterCollection.dateFilter,
      field === 'fromDateFilter' ? dateFilterValue : this.state.dateFilterCollection.fromDateFilter,
      field === 'toDateFilter' ? dateFilterValue : this.state.dateFilterCollection.toDateFilter,
    )
    this.setState({
      dateFilterCollection: {
        ...this.state.dateFilterCollection,
        [field]: dateFilterValue,
      },
      filterItems: dateFilterValue === '' ? this.state.items : this.state.filterItems,
      changeFilter,
    })
  }

  resetFilterDate = () => {
    const changeFilter = this.checkVoidAllFilter('', '', '')
    this.setState({
      dateFilterCollection: {
        dateFilter: '',
        fromDateFilter: '',
        toDateFilter: '',
      },
      filterItems: this.state.items,
      changeFilter,
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
    const checkFullInputFilterCollection = this.checkInputFilterCollectionExceptOne(name)
    const checkFullDateFilterCollection = this.checkDateFilter(
      this.state.dateFilterCollection.dateFilter,
      this.state.dateFilterCollection.fromDateFilter,
      this.state.dateFilterCollection.toDateFilter)
    this.setState({
      inputFieldCollection: {
        ...this.state.inputFieldCollection,
        [name]: {
          ...this.state.inputFieldCollection[name],
          value: '',
        },
      },
      changeFilter: checkFullInputFilterCollection || checkFullDateFilterCollection,
      filterItems: this.state.items,
    })
  }

  filterForInput = (filterItems) => {
    let newFilterItems = filterItems
    for (const i in this.state.inputFieldCollection) {
      if (this.state.inputFieldCollection[i].value !== '') {
        const el = this.state.inputFieldCollection[i]
        newFilterItems = newFilterItems.filter(item => {
          const itemStr = item[el.name].toLowerCase()
          return _.includes(itemStr, el.value)
        })
      }
    }
    return newFilterItems
  }

  filterData = () => {
    let filterItems = this.newFilteredData()
    filterItems = this.filterForInput(filterItems)

    this.setState({
      filterItems,
      changeFilter: false,
    })
  }

  changeInputFilter = (nameFilterInput, valueFilterInput) => {
    const changeFilter = valueFilterInput !== ''
    this.setState({
      inputFieldCollection: {
        ...this.state.inputFieldCollection,
        [nameFilterInput]: {
          ...this.state.inputFieldCollection[nameFilterInput],
          value: valueFilterInput,
        },
      },
      filterItems: valueFilterInput === '' ? this.state.items : this.state.filterItems,
      changeFilter,
    })
  }

  render() {
    const {
      filterItems,
      activeConditionDate,
      changeFilter,
    } = this.state

    return (
      <div>
        <FilterPanel
          fields={fields.fields}
          changeFilter={changeFilter}
          changeDate={this.changeDate}
          changeInputFilter={this.changeInputFilter}
          filterData={this.filterData}
          condition={condition}
          handleChangeCondition={this.handleChangeCondition}
          activeConditionDate={activeConditionDate}
          resetFilterDate={this.resetFilterDate}
          resetFilterInput={this.resetFilterInput}
        />
        <Content
          fields={fields.fields}
          items={filterItems}
        />
      </div>
    )
  }
}
