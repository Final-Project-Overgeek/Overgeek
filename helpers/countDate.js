function countDate(type) {
  const today = new Date()
  let year = Number(JSON.stringify(today).split("T")[0].split('"')[1].split("-")[0])
  let month = Number(JSON.stringify(today).split("T")[0].split('"')[1].split("-")[1])
  let day = Number(JSON.stringify(today).split("T")[0].split('"')[1].split("-")[2])
  if (type === 50000) {
    month += 1
  } else if (type === 150000) {
    month += 6
  } else if (type === 400000) {
    year += 1
  }
  return new Date(year, month, day)
}

module.exports = countDate