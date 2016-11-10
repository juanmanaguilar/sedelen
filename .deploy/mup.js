module.exports = {
  servers: {
    one: {
      host: '10.141.0.18',
      username: 'juan',
      // pem:
      password:'fcmdip1',
      // or leave blank for authenticate from ssh-agent
      opts: {
          port: 22,
      },
    }
  },

  meteor: {
    name: 'sedelen',
    path: '../',
    servers: {
      one: {}
    },
    buildOptions: {
      serverOnly: true,
    },
    env: {
      ROOT_URL: 'http://sedelen.lsi.us.es',
      MONGO_URL: 'mongodb://localhost/meteor'
    },
    docker: {
//       dockerImage: 'kadirahq/meteord' 
        image: 'abernix/meteord:base'
    },
    
    deployCheckWaitTime: 60
  },

  mongo: {
    oplog: true,
    port: 27017,
    servers: {
      one: {},
    },
  },
};