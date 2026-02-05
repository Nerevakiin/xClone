import { validator } from 'validator'
// import { getDBConnection } from '../db/db.js'
// import bcrypt from 'bcryptjs'

export async function registerUser(req, res) {
    
    console.log('req.body before server side correction: ', req.body)
    
    let {name, email, username, password} = req.body // destructuring the body properties

    // check if all necessary properties exist, otherwise return
    if (!!name || !email || !username || !password) {
        return res.status(400).json({ error: 'All fields are required'})
    }

    // trim them of unecessary spaces
    name = name.trim()
    email = email.trim()
    username = username.trim()

    // check the username regex requirements
    if (!/^[a-zA-Z0-9_-]{1,20}$/.test(username)) {
        return res.status(400).json({error: 'invalid username'})
    }

    // check if the email is actually an email
    if (!validator.isEmail(email)) {
        res.status(400).json({error: 'invalid email'})
    }

    console.log('req.body after server side correction: ', req.body)

}