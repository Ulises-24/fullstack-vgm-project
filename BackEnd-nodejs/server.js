const app = require('./src/app');
const logger = require('./src/utils/logger');
const { PORT, NODE_ENV } = require('./src/config/environment');
const { connectDB } = require('./src/config/database');

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`🚀 Server running in http://localhost:${PORT}`)
      logger.info(`⚙️ Environment mode ${NODE_ENV}`)
      logger.info(`📊 Process ID: ${process.pid}`);
    })
  } catch (error) {
    logger.error(`Error initializing server`, error);
    process.exit(1);
  }
};

startServer();