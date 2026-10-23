const app = require("./app");

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`app is listening to port number ${port}`);
});
