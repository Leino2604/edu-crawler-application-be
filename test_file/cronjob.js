const schedule = require('node-schedule');

// Công việc chạy mỗi phút
const job1 = schedule.scheduleJob('*/1 * * * *', function(){
  console.log('Công việc này chạy mỗi phút');
  console.log(Date());
});

// Công việc chạy mỗi ngày lúc 23:59
const job2 = schedule.scheduleJob('32 22 * * *', function(){
  console.log('Công việc này chạy mỗi ngày lúc 23:32');
  console.log(Date());
});
