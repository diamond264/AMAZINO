var CronJob = require('cron').CronJob;
new CronJob('0 0 0 * * *', () => {
    console.log("Started to expire items on dueDate");
    require('./Firebase').expireItems(new Date());
}, null, true, 'America/Los_Angeles');