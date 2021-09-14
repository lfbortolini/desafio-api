const app = require("./app");

require("./database");

const port = process.env.port || 3031;
app.listen(port);
