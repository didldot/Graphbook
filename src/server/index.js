import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compress from 'compression';
import services from './services';

const app = express();

if(process.env.NODE_ENV === 'production') {
  app.use(helmet());
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "*.amazonaws.com"]
    }
  }));
  app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
  app.use(compress());
  app.use(cors());
}

//bind the GraphQL server to the Express.js web server
const serviceNames = Object.keys(services);
for(let i=0; i<serviceNames.length; i += 1){
  const name = services[i];
  if(name === 'graphql'){
    services[name].applyMiddleware({ app });
  }else{
    //folgende Zeile funzt nicht!!
    //app.use(`/${name}`, services[name]);
  }
}

app.get('/', (req,res) => {
    console.log("hello");
})

app.listen(8001, () => console.log('Listening on port 8001!'));


