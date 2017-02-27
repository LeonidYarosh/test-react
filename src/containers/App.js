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

  equalsFilterDate = () => {
    return this.state.items.filter(item => {
      return moment(item['Date Submitted']).format('L') === moment(this.state.dateFilter).format('L')
    })
  }

  beforeFilterDate = () => {
    const selectDay = moment(this.state.dateFilter).format('L')
    return this.state.items.filter(item => {
      const dayItem = moment(item['Date Submitted']).format('L')
      return moment(dayItem).isBefore(selectDay)
    })
  }

  afterFilterDate = () => {
    const selectDay = moment(this.state.dateFilter).format('L')
    return this.state.items.filter(item => {
      const dayItem = moment(item['Date Submitted']).format('L')
      return moment(dayItem).isAfter(selectDay)
    })
  }

  betweenFilterDate = () => {
    const selectFromDay = moment(this.state.fromDateFilter).format('L')
    const selectToDay = moment(this.state.toDateFilter).format('L')
    return this.state.items.filter(item => {
      const dayItem = moment(item['Date Submitted']).format('L')
      return moment(dayItem).isBetween(selectFromDay, selectToDay)
    })
  }

  switchFunctionConditionFilterDate = () => {
    switch (this.state.activeConditionDate) {
      case 'equals': {
        return this.equalsFilterDate()
      }
      case 'before': {
        return this.beforeFilterDate()
      }
      case 'after': {
        return this.afterFilterDate()
      }
      case 'between': {
        return this.betweenFilterDate()
      }
      default: {
        return this.equalsFilterDate()
      }
    }
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

  changeEqualsDate = (dateFilter) => {
    const newState = dateFilter === '' ? {
      dateFilter,
      changeFilter: false,
      filterItems: this.state.items,
    } : {
      dateFilter,
      changeFilter: true,
    }
    this.setState(newState)
  }

  changeBetweenFromDate = (fromDateFilter) => {
    const newState = fromDateFilter === '' ? {
      fromDateFilter,
      changeFilter: false,
      filterItems: this.state.items,
    } :
    {
      fromDateFilter,
      changeFilter: true,
    }
    this.setState(newState)
  }

  changeBetweenToDate = (toDateFilter) => {
    const newState = toDateFilter === '' ? {
      toDateFilter,
      changeFilter: false,
      filterItems: this.state.items,
    } : {
      toDateFilter,
      changeFilter: true,
    }
    this.setState(newState)
  }

  filterData = () => {
    const filterItems = this.switchFunctionConditionFilterDate()
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
          changeEqualsDate={this.changeEqualsDate}
          changeFilter={changeFilter}
          filterData={this.filterData}
          condition={condition}
          handleChangeCondition={this.handleChangeCondition}
          activeConditionDate={activeConditionDate}
          changeBetweenFromDate={this.changeBetweenFromDate}
          changeBetweenToDate={this.changeBetweenToDate}
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
