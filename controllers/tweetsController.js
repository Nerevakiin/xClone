import {tweetsData} from '../data.js'

export async function getTweets(req, res) {
    console.log('controller reached')
    res.json(tweetsData)
}