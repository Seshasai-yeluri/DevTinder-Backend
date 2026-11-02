const { Queue } = require("bullmq");
const { connection } = require("../utils/redis");

const emailQueue = new Queue("welcomeEmail", {
  connection,
});

module.exports = emailQueue;
