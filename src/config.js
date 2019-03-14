/* eslint-disable no-unused-vars */
import path from 'path'
import merge from 'lodash/merge'

/* istanbul ignore next */
const requireProcessEnv = (name) => {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable')
  }
  return process.env[name]
}

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv-safe')
  dotenv.load({
    path: path.join(__dirname, '../.env'),
    sample: path.join(__dirname, '../.env.example')
  })
}

const config = {
  all: {
    env: process.env.NODE_ENV || 'development',
    root: path.join(__dirname, '..'),
    port: process.env.PORT || 9000,
    ip: process.env.IP || '0.0.0.0',
    apiRoot: process.env.API_ROOT || '',
    defaultEmail: 'no-reply@mongo-rest.com',
    sendgridKey: requireProcessEnv('SENDGRID_KEY'),
    masterKey: requireProcessEnv('MASTER_KEY'),
    jwtSecret: requireProcessEnv('JWT_SECRET'),
    mongo: {
      options: {
        db: {
          safe: true
        }
      }
    },
    swagger: {
      swaggerDefinition: {
          info: {
              description: 'This is a sample server',
              title: 'Swagger',
              version: '1.0.0',
          },
          host: 'localhost:9000',
          basePath: '/v1',
          produces: [
              "application/json",
              "application/xml"
          ],
          schemes: ['http', 'https'],
          securityDefinitions: {
              JWT: {
                  type: 'apiKey',
                  in: 'header',
                  name: 'Authorization',
                  description: "",
              }
          }
      },
      basedir: __dirname, //app absolute path
      files: ['./src/api/index.js'] //Path to the API handle folder
    }
  },
  test: { },
  development: {
    mongo: {
      uri: 'mongodb://localhost/mongo-rest-dev',
      options: {
        debug: true
      }
    }
  },
  production: {
    ip: process.env.IP || undefined,
    port: process.env.PORT || 8080,
    mongo: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost/mongo-rest'
    }
  }
}

module.exports = merge(config.all, config[config.all.env])
export default module.exports
