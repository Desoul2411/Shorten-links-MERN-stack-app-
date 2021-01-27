const express = require('express');
const config = require('config');
const mongoose = require('mongoose');

const app = express();

app.use(express.json({ extended: true }));  // middleware to parse req.body from streams to json (use in http.hook)

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/link', require('./routes/links.routes'));

const PORT = config.get('port') || 5000


async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'),  {  //connect to MongoDB
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        app.listen(PORT, () => console.log(`App has been started on ${PORT}...`));
    } catch(e) {
        console.log('Server error',e.message);
        process.exit(1);
    }
}

start()
