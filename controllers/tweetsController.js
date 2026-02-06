import {tweetsData} from '../data.js'

export async function getTweets(req, res) {
    console.log('tweets controller reached')
    res.json(tweetsData)
}