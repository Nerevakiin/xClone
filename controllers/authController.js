// import { validator } from 'validator'
// import { getDBConnection } from '../db/db.js'
// import bcrypt from 'bcryptjs'

export async function registerUser(req, res) {
    console.log('auth controller reached')
    console.log('req.body is: ', req.body)

    res.json({message: 'user registered succesfully'})
}