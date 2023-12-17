class AuthServiceMiddleware {
    

    static execute(roles) {
        return async (request, response, next) => {
            const logService = request.app.get('LogAdapter')
            const authService = request.app.get('AuthAdapter')
            try {
        
        

            const token = request.headers.authorization
            if(!token) {
                await logService.execute('StandsService', 'Missing token', 'error')
                return response.status(401).json({ error: 'Missing token' })
            }
            const decodedToken = await authService.login(token)
            if(decodedToken.status !== 200) {
                await logService.execute('StandsService', 'Invalid token', 'error')
                return response.status(401).json(decodedToken.data)
            }
                 
                if(roles.length > 0 && !roles.includes(decodedToken.body.role_id)){
                    return response.status(403).json({message: "Operation not allowed"})
                }
                next()
        }
        
        catch {
          await logService.execute('StandsService', 'Token expired', 'error')
          return response.status(401).json({message: "Token expired"})
        }
    }
  } 
}

module.exports = AuthServiceMiddleware