const express = require("express");
const app = express();
const port = process.env.PORT;
const { connectDB } = require("./utils/db_util");
connectDB();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const postsRoute = require("./routes/posts_routes");
const commentsRoute = require("./routes/comments_routes")
app.use("/post", postsRoute);
app.use("/comment", commentsRoute);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
