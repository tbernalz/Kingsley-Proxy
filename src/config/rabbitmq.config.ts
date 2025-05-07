export const rabbitMQConfig = () => ({
  exchanges: {
    consumer: {
      user: 'kingsley_proxy_users_requests',
    },
    publisher: {
      notification: 'hedwig_notification_users',
      auth: 'madeye_auth_users',
    },
  },
  queues: {
    notificationRequest: 'notification.request.queue',
    userRequest: 'users.request.queue',
  },
  routingKeys: {
    authRequest: 'auth.request',
    notificationRequest: 'notification.request',
    userRequest: 'user.request',
  },
});
