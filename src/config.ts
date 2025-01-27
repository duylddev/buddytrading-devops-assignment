import { Config } from './type/config.type'
import dotenv from 'dotenv'

dotenv.config()

const args = process.argv.slice(2)
const configArg = args.find((arg) => arg.startsWith('--config='))

if (!configArg) {
  console.error('Please provide a config file path using --config=<path>')
  process.exit(1)
}

const configPath = configArg.split('=')[1]

let config: Config

try {
  config = require(configPath)
  console.log('Loaded configuration:', config)
} catch (error) {
  console.error('Error loading config file:', error)
  process.exit(1)
}

export default config
