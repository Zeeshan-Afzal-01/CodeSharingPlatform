import { config } from 'dotenv';
config({ path: './.env' });
import express from 'express';

import './connection.js';
import userRouter from './routers/user.js';
import codeRouter from './routers/code.js';
import meetingRouter from './routers/meeting.js';
import messageRouter from './routers/message.js';
import teamRouter from './routers/team.js';
import bodyParser from 'body-parser';
import passport from './middleware/auth.js';
import cors from 'cors';
import path from "path";
import { fileURLToPath } from 'url';
import addCleanupJob from './utils/otpCleanup.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, 
  })
);

// Middleware for parsing JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('Hello From Server...!');
});

app.use(passport.initialize());

// Routes
app.use('/users', userRouter);
app.use('/code', codeRouter);
app.use('/meeting', meetingRouter);
app.use('/message', messageRouter);
app.use('/team', teamRouter);

addCleanupJob();

app.listen(process.env.PORT, () => {
  console.log(`The Server is Started at http://localhost:${process.env.PORT}`);
});
