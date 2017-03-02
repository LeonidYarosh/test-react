import React, {Component} from 'react'
import FilterPanel from '../components/filterPanel/FilterPanel'
import Content from '../components/Content'
import itemsMock from '../mock/items.json'
import fields from '../mock/fields.json'
import {formatingItems} from '../util/formatingDataContent'
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
    dateFilter: '',
    fromDateFilter: '',
    toDateFilter: '',
    nameFilterInput: '',
    valueFilterInput: '',
    changeFilter: false,
    items: [],
    filterItems: [],
    activeConditionDate: 'equals',
    setingsFilterDate: this.equalsSetingsFilter,
  }

  reloadData = () => {
    const items = formatingItems(itemsMock)
    this.setState({
      items,
      filterItems: items,
    })
  }

  checkVoidAllFilter = (dateFilter, fromDateFilter, toDateFilter, valueFilterInput) => {
    return dateFilter !== '' || fromDateFilter !== '' ||
      toDateFilter !== '' || valueFilterInput !== ''
  }

  componentDidMount() {
    this.reloadData()
  }

  switchCoditionFilterDate = (item, dayItem, selectDay, selectFromDay, selectToDay) => {
    switch (this.state.activeConditionDate) {
      case 'equals': {
        return moment(item['Date Submitted']).format('L') === moment(this.state.dateFilter).format('L')
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
        return moment(item['Date Submitted']).format('L') === moment(this.state.dateFilter).format('L')
      }
    }
  }

  newFilteredData = () => {
    if (this.state.dateFilter !== '' ||
      this.state.fromDateFilter !== '' ||
      this.state.toDateFilter !== '') {
      const selectDay = moment(this.state.dateFilter).format('L')
      const selectFromDay = moment(this.state.fromDateFilter).format('L')
      const selectToDay = moment(this.state.toDateFilter).format('L')

      return this.state.items.filter(item => {
        const dayItem = moment(item['Date Submitted']).format('L')
        return this.switchCoditionFilterDate(item, dayItem, selectDay, selectFromDay, selectToDay)
      })
    }
    return this.state.filterItems
  }

  checkValidDate = (item) => {
    if (moment(this.state.dateFilter).isValid() && item !== 'between') {
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
      field === 'dateFilter' ? dateFilterValue : this.state.dateFilter,
      field === 'fromDateFilter' ? dateFilterValue : this.state.fromDateFilter,
      field === 'toDateFilter' ? dateFilterValue : this.state.toDateFilter,
      this.state.valueFilterInput
    )
    this.setState({
      [field]: dateFilterValue,
      filterItems: dateFilterValue === '' ? this.state.items : this.state.filterItems,
      changeFilter,
    })
  }

  resetFilterDate = () => {
    const changeFilter = this.checkVoidAllFilter('', '', '', this.state.valueFilterInput)
    this.setState({
      dateFilter: '',
      fromDateFilter: '',
      toDateFilter: '',
      filterItems: this.state.items,
      changeFilter,
    })
  }

  filterForInput = (filterItems) => {
    if (this.state.nameFilterInput !== '') {
      return filterItems.filter(item => {
        const itemStr = item[this.state.nameFilterInput].toLowerCase()
        return _.includes(itemStr, this.state.valueFilterInput)
      })
    }
    return filterItems
  }

  filterData = () => {
    let filterItems = this.newFilteredData()
    filterItems = this.filterForInput(filterItems)

    this.setState({
      filterItems,
      changeFilter: false,
    })
  }

  inputFilterDefinition = (nameFilterInput, valueFilterInput) => {
    const changeFilter = this.checkVoidAllFilter(
      this.state.dateFilter,
      this.state.fromDateFilter,
      this.state.toDateFilter,
      valueFilterInput
    )
    this.setState({
      nameFilterInput,
      valueFilterInput,
      filterItems: valueFilterInput === '' ? this.state.items : this.state.filterItems,
      changeFilter,
    })
  }

  render() {
    const {
      filterItems,
      dateFilter,
      activeConditionDate,
      changeFilter,
    } = this.state

    return (
      <div>
        <FilterPanel
          fields={fields.fields}
          changeDate={this.changeDate}
          changeFilter={changeFilter}
          filterData={this.filterData}
          condition={condition}
          handleChangeCondition={this.handleChangeCondition}
          activeConditionDate={activeConditionDate}
          correctDateInput={moment(dateFilter, 'L', true).isValid()}
          inputFilterDefinition={this.inputFilterDefinition}
          resetFilterDate={this.resetFilterDate}
        />
        <Content
          fields={fields.fields}
          items={filterItems}
        />
      </div>
    )
  }
}
