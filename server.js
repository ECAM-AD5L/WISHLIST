import Express from 'express';
import GraphqlHTTP from 'express-graphql';
import Schema from './schema';

// configuration
const APP_PORT = 3005;
const app = Express();

app.use('/graphql', GraphqlHTTP({
    schema: Schema,
    pretty: true,
    graphiql: true
}));
app.listen(APP_PORT, ()=> {
    console.log(`App listening on port ${APP_PORT}`);
});
