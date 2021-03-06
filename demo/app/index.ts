import { FrameworkConfig } from 'ext-framework-server/interfaces';
import * as express from 'express'
import * as bodyParser from 'body-parser'
import { frameworkAPI } from 'ext-framework-server/api'
import * as dotenv from 'dotenv';

const config: FrameworkConfig = {
  db: {
    cassandra: {
      contactPoints: ['127.0.0.1'],
      defaultKeyspaceSettings: {
        replication: {
          'class': 'SimpleStrategy',
          'replication_factor': '1'
        }
      }
    },
    elasticsearch: {
      host: "127.0.0.1:9200",
      disabledApis: ["cat", "cluster", "ingest", "nodes", "remote", "snapshot", "tasks"]
    }
  },
  plugins: [
    { id: 'hello-world', ver: '1.0' },
    // { id: 'profile-server', ver: '1.0' }, 
    { id: 'form-service', ver: '1.0' }
  ],
  pluginBasePath: __dirname + '/node_modules/',
  port: 4000,
  logLevel: 'debug'
};

const expressApp = express()
expressApp.use(bodyParser.json({ limit: '50mb' }))
expressApp.use(express.static('public'));

frameworkAPI.bootstrap(config, expressApp).then(() => {
  dotenv.config();
  console.log(`=====> Application running on port: ${config.port}`);
  expressApp.listen(config.port);
}).catch((error) => {
  console.log(`=====> Application failed to run!`, error);
})

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});
