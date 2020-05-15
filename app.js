require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const mongooose = require('mongoose');
const port = process.env.port || 3000;

mongooose.connect('mongodb://localhost:27017/xxx', { useNewUrlParser: true, useUnifiedTopology: true });

const indexRouter = require('./routes/index');

const store = new MongoStore({
  collection: 'sessions',
  uri: 'mongodb://localhost:27017/xxx',
});

// Подключаем handlebars и указываем путь до папки views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Подключаем возможность читать формат json на сервере
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Подключаем статичные маршруты
app.use(express.static(path.join(__dirname, 'public')));

// Настраиваем объект сессии
app.use(session({
  secret: 'someSecretWord',
  resave: false,
  saveUninitialized: false,
  store, // указываем хранить сессии в MongoStore
}));

// Подключаем middleware для проверки сессии пользователя
app.use((req, res, next) => {
  res.locals.isAuth = req.session.auth;
  res.locals.username = req.session.username;
  next();
});

// Указываем ссылки на роутеры
app.use('/', indexRouter);

app.listen(process.env.port, () => {
  console.log('Server is up on port ', process.env.port);
});
