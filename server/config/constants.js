const actions = {
  create: 'Create',
  update: 'Update',
  remove: 'Remove',
  find: 'Find',
  findAll: 'Find All'
}

const models = {
  user: {
    name: 'User',
    endpoint: 'users',
    preventDefaultApi: true,
    useCustomRoutes: true
  },
  fight: {
    name: 'Fight',
    endpoint: 'fights',
    // preventDefaultApi: true
    // useCustomRoutes: true
  },
  injury: {
    name: 'Injury',
    endpoint: 'injuries',
    // preventDefaultApi: true
    // useCustomRoutes: true
  },
  game: {
    name: 'Game',
    endpoint: 'games',
    // preventDefaultApi: true,
    useCustomRoutes: true
  }
  // More models here in future
}


export {
  actions,
  models
}