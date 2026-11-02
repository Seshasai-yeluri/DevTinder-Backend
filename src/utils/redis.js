const { createClient } = require("redis");
const { createNodeRedisClient } = require("bullmq");

const redisClient = createClient({
  username: "default",
  password: "DVvUqk3jCT7myIA6XsIeenKnQ3HBlh5s",
  socket: {
    host: "redis-17013.crce309.us-east-1-6.ec2.cloud.redislabs.com",
    port: 17013,
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

const connectRedis = async () => {
  await redisClient.connect();
};

//configuring redis for bullmq
const bullmqRedisClient = createClient({
  username: "default",
  password: "DVvUqk3jCT7myIA6XsIeenKnQ3HBlh5s",
  socket: {
    host: "redis-17013.crce309.us-east-1-6.ec2.cloud.redislabs.com",
    port: 17013,
  },
});
const connection = createNodeRedisClient(bullmqRedisClient);

module.exports = { connectRedis, redisClient, connection };
