export const formatAmount = (amount, options = {}) => {
  const {
    currency = 'USD',
    locale = 'en-US',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options

  if (amount === null || amount === undefined || isNaN(amount)) {
    return ''
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount)
}

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}
