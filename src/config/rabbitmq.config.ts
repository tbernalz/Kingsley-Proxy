export const rabbitMQConfig = () => ({
  exchanges: {
    consumer: {
      user: 'kingsley_proxy_users_requests',
    },
    publisher: {},
  },
  queues: {
    userRequest: 'users.request.queue',
  },
  routingKeys: {
    userRequest: 'user.request',
  },
});
