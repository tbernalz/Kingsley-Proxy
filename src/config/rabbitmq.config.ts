export const rabbitMQConfig = () => ({
  queues: {
    consumer: {
      user: 'kingsley_proxy_users_requests',
    },
    publiser: {
      user: 'kingsley_proxy_users_responses',
    },
  },
});
