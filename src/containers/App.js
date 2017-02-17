import React, {Component} from 'react'
import FilterPanel from '../components/filterPanel/FilterPanel'
import Content from '../components/Content'
import fields from '../mock/fields.json'
import items from '../mock/items.json'
import moment from 'moment'

export default class App extends Component {

  state = {
    dateFilter: '',
    changeFilter: false,
    filterItems: items.items,
    applyFilter: false,
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
    const filterItems = items.items.filter(item => {
      if (moment(item['Date Submitted']).format('L')
        === moment(this.state.dateFilter).format('L')) {
        return item
      }
    })
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
        />
        <Content
          fields={fields.fields}
          items={filterItems}
        />
      </div>
    )
  }
}
