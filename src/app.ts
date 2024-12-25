import cors from 'cors';
import express, { Application } from 'express';
import router from './app/Module/userModel/user.router';
import blogRouter from './app/Module/blogModel/blog.router';

const app: Application = express();

app.use(express.json());
app.use(cors());

//--------user api Routes--------
app.use('/api',router)

//--------blog api Routes--------
app.use('/api',blogRouter)

app.get('/', (req, res) => {
  res.send('Asserment 3 ');
});

export default app;
