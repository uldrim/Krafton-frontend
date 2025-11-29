const express = require("express");
const path = require("path");

const app = express();

const publicPath = path.join(__dirname, "src");

app.use(express.static(publicPath));

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Frontend running at http://localhost:${PORT}`);
});
