import React, {Component} from 'react'
import FilterPanel from '../components/filterPanel/FilterPanel'
import Content from '../components/Content'
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
    applyFilter: false,
    activeConditionDate: 'equals',
    setingsFilterDate: this.equalsSetingsFilter,
  }

  reloadData = () => {
    const items = formatingItems()
    this.setState({
      items: items,
      filterItems: items,
    })
  }

  componentDidMount() {
    this.reloadData()
  }

  equalsFilterDate = () => {
    return this.state.items.filter(item => {
      if (moment(item['Date Submitted']).format('L')
        === moment(this.state.dateFilter).format('L')) {
        return item
      }
    })
  }

  beforeFilterDate = () => {
    const selectDay = moment(this.state.dateFilter).format('L')
    return this.state.items.filter(item => {
      const dayItem = moment(item['Date Submitted']).format('L')
      if (moment(dayItem).isBefore(selectDay)) {
        return item
      }
    })
  }

  afterFilterDate = () => {
    const selectDay = moment(this.state.dateFilter).format('L')
    return this.state.items.filter(item => {
      const dayItem = moment(item['Date Submitted']).format('L')
      if (moment(dayItem).isAfter(selectDay)) {
        return item
      }
    })
  }

  betweenFilterDate = () => {
    const selectFromDay = moment(this.state.fromDateFilter).format('L')
    const selectToDay = moment(this.state.toDateFilter).format('L')
    return this.state.items.filter(item => {
      const dayItem = moment(item['Date Submitted']).format('L')
      if (moment(dayItem).isBetween(selectFromDay, selectToDay)) {
        return item
      }
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
        this.setState({setingsFilterDate: this.equalsSetingsFilter})
        break
      }
    }
  }

  handleChangeCondition = (item) => {
    this.setState({
      activeConditionDate: item,
    })
  }

  changeEqualsDate = (dateFilter) => {
    dateFilter === '' ?
      this.setState({
        dateFilter,
        changeFilter: false,
        filterItems: this.state.items,
        applyFilter: false,
      }) :
      this.setState({
        dateFilter,
        changeFilter: true,
        applyFilter: true,
      })
  }

  changeBetweenFromDate = (fromDateFilter) => {
    fromDateFilter === '' ?
      this.setState({
        fromDateFilter,
        changeFilter: false,
        filterItems: this.state.items,
        applyFilter: false,
      }) :
      this.setState({
        fromDateFilter,
        changeFilter: true,
        applyFilter: true,
      })
  }

  changeBetweenToDate = (toDateFilter) => {
    toDateFilter === '' ?
      this.setState({
        toDateFilter,
        changeFilter: false,
        filterItems: this.state.items,
        applyFilter: false,
      }) :
      this.setState({
        toDateFilter,
        changeFilter: true,
        applyFilter: true,
      })
  }

  filterData = () => {
    const filterItems = this.switchFunctionConditionFilterDate()
    this.setState({
      filterItems,
      applyFilter: true,
    })
  }

  render() {
    const {
      filterItems,
    } = this.state
    return (
      <div>
        <FilterPanel
          fields={fields.fields}
          changeEqualsDate={this.changeEqualsDate}
          changeFilter={this.state.changeFilter}
          filterData={this.filterData}
          condition={condition}
          handleChangeCondition={this.handleChangeCondition}
          activeConditionDate={this.state.activeConditionDate}
          changeBetweenFromDate={this.changeBetweenFromDate}
          changeBetweenToDate={this.changeBetweenToDate}
        />
        <Content
          fields={fields.fields}
          items={filterItems}
        />
      </div>
    )
  }
}
