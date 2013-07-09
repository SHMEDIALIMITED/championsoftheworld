var fs = require('fs');
module.exports = {
    development: {
      version : JSON.parse(fs.readFileSync('./package.json')).version,
      root: require('path').normalize(__dirname + '/..'),
      app: {
        name: 'Web App Dev'
      },
      db: 'mongodb://localhost/championsoftheworld',
      host : 'http://localhost',
      twitter: {
        consumer_key: 'u6GPk5YU3FlI5ulxesBPg',
        consumer_secret: '0kT0ITCJ2p37hXh4166KTM4eZrKp9vifQKOh3Ls0',
        access_token_key: '22387661-xyP2A4NB7WbSJ5inouaLvXFncnLI0Tk7BwoquIpRw',
        access_token_secret: 'OzQSN1gWAiOOb4IazfSttpX4Qv0uoVDV4Fwox7GjqI'
      },
      hashtag : 'KeepOnPushing'
      
    }
  , production: {
      version : JSON.parse(fs.readFileSync('./package.json')).version,
      root: require('path').normalize(__dirname + '/..'),
      app: {
        name: 'Web App'
      },
      db: process.env.MONGOLAB_URI,
      host : 'http://champions-of-the-world.herokuapp.com',
      twitter: {
        consumer_key: 'u6GPk5YU3FlI5ulxesBPg',
        consumer_secret: '0kT0ITCJ2p37hXh4166KTM4eZrKp9vifQKOh3Ls0',
        access_token_key: '22387661-xyP2A4NB7WbSJ5inouaLvXFncnLI0Tk7BwoquIpRw',
        access_token_secret: 'OzQSN1gWAiOOb4IazfSttpX4Qv0uoVDV4Fwox7GjqI'
      },
      hashtag : 'championsoftheworld'


    }
}