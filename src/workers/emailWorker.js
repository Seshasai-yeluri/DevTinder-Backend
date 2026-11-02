const { Worker } = require("bullmq");
const { connection } = require("../utils/redis");

const sendWelcomeEmail = async (fullName, emailId) => {
  console.log(`Welcome mail sent to ${fullName}, emailId: ${emailId}`);
};

const emailWorker = new Worker(
  "welcomeEmail",
  async (job) => {
    console.log(`Processing job: ${job.id}, name: ${job.name}`);

    const { fullName, emailId } = job.data;

    await sendWelcomeEmail(fullName, emailId);
  },
  {
    connection,
  },
);

emailWorker.on("completed", (job) => {
  console.log(`Email job completed successfully. Job ID: ${job.id}`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`Email job ${job?.id} failed:`, err.message);
});

emailWorker.on("error", (err) => {
  console.error("BullMQ worker error:", err);
});

module.exports = emailWorker;
