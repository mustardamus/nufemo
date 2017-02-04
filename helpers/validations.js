import isAlphanumeric from 'validator/lib/isAlphanumeric'

export const username = value => {
  return isAlphanumeric(value)
}
