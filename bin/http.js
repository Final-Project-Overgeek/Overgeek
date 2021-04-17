const app = require("../app")
const port = process.env.PORT || 3001


app.listen(port, function () {
  console.log(`this app is running on port ${port}`)
})
