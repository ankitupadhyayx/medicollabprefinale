const AuditLog = require('../models/AuditLog');

exports.logAudit = async ({
  action,
  performedBy,
  targetResource = {},
  status = 'SUCCESS',
  severity = 'INFO',
  details = {},
  req
}) => {
  try {
    const log = new AuditLog({
      action,
      performedBy,
      targetResource,
      status,
      severity,
      details,
      ipAddress: req?.ip || req?.connection?.remoteAddress,
      userAgent: req?.headers?.['user-agent']
    });

    await log.save();
    return log;
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
};