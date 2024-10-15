import express from 'express';
import bodyParser from 'body-parser';
import authRouter from './routes/authRoutes';

const app = express();

app.use(bodyParser.json());

app.use('/auth', authRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000...');
});
