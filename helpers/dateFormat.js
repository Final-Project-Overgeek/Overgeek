function dateFormat(payload) {
  // console.log(payload.split(' ')[0].split('-')[0] + 'a')
  let year = Number((payload).split(" ")[0].split('-')[0])
  let month = Number(JSON.stringify(payload).split(" ")[0].split('-')[1])
  let day = Number(JSON.stringify(payload).split(" ")[0].split('-')[2])
  console.log(year, month, day)
  return new Date(year, month, day)
}

module.exports = dateFormat