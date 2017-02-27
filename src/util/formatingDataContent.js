import moment from 'moment'

export function formatingItems(items) {
  return items.items.map(item =>{
    item['Date Submitted'] = moment(item['Date Submitted']).format('L')
    return item
  })
}
