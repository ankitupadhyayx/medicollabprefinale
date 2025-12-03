const { logAudit } = require('../utils/auditLogger');

// Middleware to automatically log certain actions
exports.auditLog = (action, getSeverity = () => 'INFO') => {
  return async (req, res, next) => {
    // Store original send
    const originalSend = res.send;

    res.send = function (data) {
      // Log the audit after response
      const status = res.statusCode >= 200 && res.statusCode < 300 ? 'SUCCESS' : 'FAILED';
      const severity = getSeverity(req, res);

      logAudit({
        action,
        performedBy: req.user?.userId,
        status,
        severity,
        details: {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode
        },
        req
      }).catch(err => console.error('Audit log failed:', err));

      // Call original send
      return originalSend.call(this, data);
    };

    next();
  };
};