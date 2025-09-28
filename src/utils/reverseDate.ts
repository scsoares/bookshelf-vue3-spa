const reverseDate = (dateInput: string) => {
  const array = dateInput.split('-')
  const newDate = array[2] + '-' + array[1] + '-' + array[0]
  return newDate
}
export default reverseDate
