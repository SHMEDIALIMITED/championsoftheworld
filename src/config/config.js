var fs = require('fs');
module.exports = {
    development: {
      version : JSON.parse(fs.readFileSync('./package.json')).version,
      root: require('path').normalize(__dirname + '/..'),
      app: {
        name: 'Web App Dev'
      },
      heartbeat : 40000,
      db: 'mongodb://localhost/championsoftheworld',
      host : 'http://localhost',
      twitter: {
        consumer_key: 'u6GPk5YU3FlI5ulxesBPg',
        consumer_secret: '0kT0ITCJ2p37hXh4166KTM4eZrKp9vifQKOh3Ls0',
        access_token_key: '22387661-xyP2A4NB7WbSJ5inouaLvXFncnLI0Tk7BwoquIpRw',
        access_token_secret: 'OzQSN1gWAiOOb4IazfSttpX4Qv0uoVDV4Fwox7GjqI'
      },
      soundcloud : {
        client_id : 'f25f647eec0a3cbb3dc868cbde9774a8',
        client_secret : '6c9874aeb126057816d314d7f3232429'
      },
      hashtag : 'KeepOnPushing'
      
    }
  , production: {
      version : JSON.parse(fs.readFileSync('./package.json')).version,
      root: require('path').normalize(__dirname + '/..'),
      app: {
        name: 'Web App'
      },
      heartbeat : 20000,
      db: process.env.MONGOLAB_URI_STRIDER || process.env.MONGOLAB_URI,
      host : 'http://champions-of-the-world.herokuapp.com',
      twitter: {
        consumer_key: process.env.TWITTER_KEY,
        consumer_secret: process.env.TWITTER_SECRET,
        access_token_key: process.env.TWITTER_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_TOKEN_SECRET
      },
      soundcloud : {
        client_id : process.env.SC_CLIENT_ID,
        client_secret : process.env.SC_CLIENT_SECRET
      },
      hashtag : 'championsoftheworld'


    }
}