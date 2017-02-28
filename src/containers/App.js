import React, {Component} from 'react'
import FilterPanel from '../components/filterPanel/FilterPanel'
import Content from '../components/Content'
import itemsMock from '../mock/items.json'
import fields from '../mock/fields.json'
import {formatingItems} from '../util/formatingDataContent'
import moment from 'moment'

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
    const selectDay = moment(this.state.dateFilter).format('L')
    const selectFromDay = moment(this.state.fromDateFilter).format('L')
    const selectToDay = moment(this.state.toDateFilter).format('L')
    return this.state.items.filter(item => {
      const dayItem = moment(item['Date Submitted']).format('L')
      return this.switchCoditionFilterDate(item, dayItem, selectDay, selectFromDay, selectToDay)
    })
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
    const newState = dateFilterValue === ''
      ? {
        [field]: dateFilterValue,
        changeFilter: false,
        filterItems: this.state.items,
      } : {
        [field]: dateFilterValue,
        changeFilter: true,
      }
    this.setState(newState)
  }

  filterData = () => {
    const filterItems = this.newFilteredData()
    this.setState({
      filterItems,
      changeFilter: false,
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
          changeDate = {this.changeDate}
          changeFilter={changeFilter}
          filterData={this.filterData}
          condition={condition}
          handleChangeCondition={this.handleChangeCondition}
          activeConditionDate={activeConditionDate}
          correctDateInput={moment(dateFilter, 'L', true).isValid()}
        />
        <Content
          fields={fields.fields}
          items={filterItems}
        />
      </div>
    )
  }
}
