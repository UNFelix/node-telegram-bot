require('http').createServer((req, resp) => resp.end('bot is running'))
  .listen(process.env.PORT || 3000, () => console.log('bot server started'))
require('dotenv').config()

const greenwich = !!process.env.PORT
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TOKEN, {polling: true});

let notes = [];

bot.onText(/напомни (.+) в (.+)/, function (msg, match) {
    notes.push({ uid: msg.from.id, time: match[2], text:match[1] });
    bot.sendMessage(msg.from.id, 'Постараюсь не забыть');
});

setInterval(() => {
  const date = new Date
  if (greenwich) date.setHours(date.getHours + 3)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const time = `${hours<10? 0 : ''}${hours}:${minutes<10? 0 : ''}${minutes}`
  const dueNotes = notes.filter(note => note.time <= time)
  notes = notes.filter(note => !dueNotes.includes(note))
  dueNotes.forEach(note =>
    bot.sendMessage(note.uid, `Напоминаю, что вы должны: ${note.text}`))
}, 1000);