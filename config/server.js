const app = require("./app")
const port = process.env.PORT || 9000;

app.listen(
   port, () => console.info(
      `Server started on port ${port}`
   )
)