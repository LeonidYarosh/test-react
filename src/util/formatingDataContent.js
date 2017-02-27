import items from '../mock/items.json'
import moment from 'moment'

export function formatingItems() {
  return items.items.map(item =>{
    item['Date Submitted'] = moment(item['Date Submitted']).format('L')
    return item
  })
}
