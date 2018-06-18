import winston, { format, transports } from 'winston';
import CloudWatchTransport from 'winston-aws-cloudwatch';

// const NODE_ENV = process.env.NODE_ENV || 'dev';
const NODE_ENV = 'dev';

const logger = winston.createLogger();

if (NODE_ENV !== 'dev') {
  const conf = {
    logGroupName: process.env.CW_LOG_GROUP || 'appt-api',
    logStreamName: NODE_ENV,
    createLogGroup: true,
    createLogStream: true,
    submissionInterval: 2000,
    submissionRetryCount: 2,
    batchSize: 20,
    awsConfig: {
      accessKeyId: process.env.CW_ACCESS_KEY_ID,
      secretAccessKey: process.env.CW_SECRET_ACCESS_KEY,
      region: process.env.CW_REGION
    },
    formatLog: l => `${l.level}: ${l.message} [${JSON.stringify(l.meta)}]`
  };
  logger.add(new CloudWatchTransport(conf));
} else {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.simple()
      )
    })
  );
}

logger.level = process.env.LOG_LEVEL || 'silly';

export default logger;

