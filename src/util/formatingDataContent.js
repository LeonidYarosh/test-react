import moment from 'moment'

export function formatingItems(items) {
  return items.map(item => {
    return item.hasOwnProperty('Date Submitted') ?
    {
      ...item,
      'Date Submitted': formattingDate(item['Date Submitted']),
    } :
    {
      ...item,
    }
  })
}

export function formatingFields(fields, conditions) {
  return fields.map(field => {
    if (field.name === 'Date Submitted') {
      return {
        ...field,
        type: 'date',
        condition: {
          type: conditions.date[0],
          value: {
            from: '',
            to: '',
          },
        },
      }
    }
    return {
      ...field,
      condition: {
        type: conditions[field.type][0],
        value: '',
      },
    }
  })
}

export function formattingDate(date) {
  return moment(date).format('L')
}
