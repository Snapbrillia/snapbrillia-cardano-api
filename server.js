const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.set("view_engine", "ejs");

require("./routes/quadraticVotingAndFunding.routes")(app);
require("./routes/cardanoUtils.routes")(app);
require("./routes/commonCardanoTransaction.routes")(app);

app.listen(8000, () => {
  console.log("Queued App is running port 8000");
});
