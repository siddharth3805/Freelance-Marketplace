import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import config from './config'
import router from './routes'
import { errorHandler } from './middleware/errorHandler'
import { notFound } from './middleware/notFound'

const app = express()

app.use(helmet())

app.use(cors({
  origin: config.clientUrl,
  credentials: true,
}))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
})
app.use('/api', limiter)

app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api', router)

app.use(notFound)
app.use(errorHandler)

app.listen(config.port, () => {
  console.log(`
  ┌─────────────────────────────────────┐
  │   Server running in ${config.nodeEnv.padEnd(14)}│
  │   http://localhost:${config.port}             │
  └─────────────────────────────────────┘
  `)
})

export default app
