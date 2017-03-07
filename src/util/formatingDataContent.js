import moment from 'moment'

export function formatingItems(items) {
  return items.items.map(item =>{
    item['Date Submitted'] = moment(item['Date Submitted']).format('L')
    return item
  })
}

export function inputFieldCollectionName(fields) {
  const inputFieldCollectionName = {}
  fields.map(el =>{
    if (el.name !== 'Date Submitted' && el.type === 'text') {
      inputFieldCollectionName[el.name] = {
        value: '',
        name: el.name,
      }
      return true
    }
  })
  return inputFieldCollectionName
}

export function formattingDate(date) {
  return moment(date).format('L')
}
