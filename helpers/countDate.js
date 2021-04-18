function countDate(type) {
  const today = new Date()
  let year = Number(JSON.stringify(today).split("T")[0].split('"')[1].split("-")[0])
  let month = Number(JSON.stringify(today).split("T")[0].split('"')[1].split("-")[1])
  let day = Number(JSON.stringify(today).split("T")[0].split('"')[1].split("-")[2])
  console.log(day, month, year)
  if (type === 'monthly') {
    month += 1
  } else if (type === 'season') {
    month += 6
  } else if (type === 'annual') {
    year += 1
  }
  console.log(day, month, year)
  return new Date(year, month, day)
}

module.exports = countDate