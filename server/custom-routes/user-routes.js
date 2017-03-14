let Users = require('../models/user')


export default {

    getUser: {
        path: '/users/:id',
        reqType: 'get',
        method(req, res, next) {
            let action = 'get a user'
            Users.findOne({ id: req.params._id })
                .then(user => {
                    res.send(handleResponse(action, user))
                }).catch(error => {
                    return next(handleResponse(action, null, error))
                })
        }
    }
}


function handleResponse(action, data, error) {
    var response = {
        action: action,
        data: data
    }
    if (error) {
        response.error = error
    }
    return response
}
 

