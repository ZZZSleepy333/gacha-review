const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (req, res) => {
  let target = "";

  // Proxy API requests
  if (req.url.startsWith("/api")) {
    target = "http://localhost:5000/";
  }

  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      "^/api": "",
    },
  })(req, res);
};
