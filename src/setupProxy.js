const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
    createProxyMiddleware('/api/auth/admin/login', {
      target: 'https://dobha.herokuapp.com',
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware('/api/auth/admin/register', {
      target: 'https://dobha.herokuapp.com/',
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware('/api/auth/admin/logout', {
      target: 'https://dobha.herokuapp.com',
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware('/api/auth/admin/read-all-admin', {
      target: 'https://dobha.herokuapp.com',
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware('/api/read-all-article', {
      target: 'https://dobha.herokuapp.com',
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware('/api/read-article', {
      target: 'https://dobha.herokuapp.com',
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware('/api/article/create-new-article', {
      target: 'https://dobha.herokuapp.com',
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware('/api/article/update-article', {
      target: 'https://dobha.herokuapp.com',
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware('/api/article/delete-article', {
      target: 'https://dobha.herokuapp.com',
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware('/api/read-product/', {
      target: 'https://dobha.herokuapp.com',
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware('/api/read-all-product', {
      target: 'https://dobha.herokuapp.com',
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware('/api/product/create-new-product', {
      target: 'https://dobha.herokuapp.com',
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware('/api/product/update-product', {
      target: 'https://dobha.herokuapp.com',
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware('/api/product/delete-product', {
      target: 'https://dobha.herokuapp.com',
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware('/api/auth/admin/dashboard-data', {
      target: 'https://dobha.herokuapp.com',
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware('/api/auth/admin/update', {
      target: 'https://dobha.herokuapp.com',
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware('/api/auth/admin/delete', {
      target: 'https://dobha.herokuapp.com',
      changeOrigin: true,
    })
  );

  app.use(
    createProxyMiddleware('/api/auth/admin/read-admin', {
      target: 'https://dobha.herokuapp.com',
      changeOrigin: true,
    })
  );
};
