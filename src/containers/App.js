import React, {Component} from 'react'
import FilterPanel from '../components/filterPanel/FilterPanel'
import Content from '../components/Content'
import fields from '../mock/fields.json'
import items from '../mock/items.json'
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
    changeFilter: false,
    filterItems: items.items,
    applyFilter: false,
    activeConditionDate: 'equals',
    setingsFilterDate: this.equalsSetingsFilter,
  }

  equalsFilterDate = () => {
    return items.items.filter(item => {
      if (moment(item['Date Submitted']).format('L')
        === moment(this.state.dateFilter).format('L')) {
        return item
      }
    })
  }

  beforeFilterDate = () => {
    const selectDay = moment(this.state.dateFilter).format('L')
    return items.items.filter(item => {
      const dayItem = moment(item['Date Submitted']).format('L')
      if (moment(dayItem).isBefore(selectDay)) {
        return item
      }
    })
  }

  afterFilterDate = () => {
    const selectDay = moment(this.state.dateFilter).format('L')
    return items.items.filter(item => {
      const dayItem = moment(item['Date Submitted']).format('L')
      if (moment(dayItem).isAfter(selectDay)) {
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
        break
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
        filterItems: items.items,
        applyFilter: false,
      }) :
      this.setState({
        dateFilter,
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
        />
        <Content
          fields={fields.fields}
          items={filterItems}
        />
      </div>
    )
  }
}
