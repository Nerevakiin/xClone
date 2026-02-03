import express from 'express'
import { getTweets } from '../controllers/tweetsController.js'


export const tweetsRouter = express.Router()

tweetsRouter.get('/', getTweets)