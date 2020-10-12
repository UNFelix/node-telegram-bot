require('http').createServer(handleRequest)
  .listen(process.env.PORT || 3000, () => console.log('bot server started'))
require('dotenv').config()

const fs = require('fs')
const greenwich = !!process.env.PORT
const TelegramBot = require('node-telegram-bot-api');
const { Recoverable } = require('repl');
const bot = new TelegramBot(process.env.TOKEN, {polling: true});

let notes = [];

bot.on('polling_error', () => {
  if (process.env.PORT) {
    process.exit(1)
  }
})

bot.onText(/напомни (.+) в (.+)/, function (msg, match) {
    notes.push({ uid: msg.from.id, time: match[2], text:match[1] });
    bot.sendMessage(msg.from.id, 'Напомню, если не забуду 😳😜');
});

setInterval(() => {
  const date = new Date
  if (greenwich) date.setHours(date.getHours + 3)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const time = `${month<10? 0 : ''}${month}.${day<10? 0 : ''}${day} ${hours<10? 0 : ''}${hours}:${minutes<10? 0 : ''}${minutes}`
  // const time = `${hours<10? 0 : ''}${hours}:${minutes<10? 0 : ''}${minutes}`
  const dueNotes = notes.filter(note => note.time <= time)
  notes = notes.filter(note => !dueNotes.includes(note))
  dueNotes.forEach(note =>
    bot.sendMessage(note.uid, `Напоминаю, что вы должны: ${note.text}`))
}, 1000);

function handleRequest(req, resp) {
  if (req.url == '/') {
    req.url = '/index.html'
  }
  try {
    resp.end(fs.readFileSync('./public' + req.url))
  } catch (error) {
    resp.end('404 Not Found')
  }
}

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});