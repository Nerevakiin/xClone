export function requireAuth(req, res, next) {

    if (!req.session.userId) {
        console.log('access has been blocked')
        return res.status(401).json({ error: 'unauthorized' })
    }

    next()
    
}