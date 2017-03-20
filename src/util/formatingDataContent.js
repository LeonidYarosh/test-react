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

export function formatingFields(fields, FILTERS) {
  return fields.map(field => {
    if (field.name === 'Date Submitted') {
      return {
        ...field,
        type: 'date',
        condition: {
          type: FILTERS.date.typesCondition[0],
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
        type: FILTERS[field.type].typesCondition[0],
        value: '',
      },
    }
  })
}

export function formattingDate(date) {
  return moment(date, moment.ISO_8601).format('YYYY-MM-DD')
}
