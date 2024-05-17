const nodemailer = require("nodemailer");
const pool = require("./db_connect");

const getScheduleList = async () => {
    await pool.connect();

    try {
        const query = `
        SELECT u."FullName", u."Mail", s."Url", s."ScheduledTime" 
        FROM public."User" AS u 
        INNER JOIN public."Spider" AS s ON u."ID" = s."CreatedByID" 
        WHERE s."IsScheduled" = True
        `;

        const result = await pool.query(query);

        // const checkTime = result.rows[0].ScheduledTime;
        // console.log(checkTime);

        // console.log(result.rows)

        for (const row of result.rows) {
            console.log(row);
            const selectedTime = row.ScheduledTime;
            const splitTime = selectedTime.split(':');
            console.log(splitTime);
        
            const now = new Date();
            const nowTime = new Date((now.getMonth()+1) + "/" + now.getDate() + "/" + now.getFullYear() + " " + now.getHours()+":"+now.getMinutes());
            const userTime = new Date((now.getMonth()+1) + "/" + now.getDate() + "/" + now.getFullYear() + " " + splitTime[0] + ":" + splitTime[1]);

            console.log(nowTime.getTime(), userTime.getTime());

            if ((nowTime.getTime() - userTime.getTime()) <= 60000 && (nowTime.getTime() - userTime.getTime()) >= 0) {
                scheduleMail(row.Mail, row.FullName, row.Url);
                console.log("passed");
            }
            else if (nowTime.getHours() == 0 && nowTime.getMinutes() == 0 && userTime.getHours() == 23 && userTime.getMinutes() == 59) {
                scheduleMail(row.Mail, row.FullName, row.Url);
                console.log("passed");
            }
            else
                console.log("failed");
        }

        // result.rows.forEach(row => {
        //     const selectedTime = row.scheduledTime;
        //     const splitTime = selectedTime.split(':');
        //     console.log(splitTime);
        
        //     const now = new Date();
        //     const nowTime = new Date((now.getMonth()+1) + "/" + now.getDate() + "/" + now.getFullYear() + " " + now.getHours()+":"+now.getMinutes());
        //     const userTime = new Date((now.getMonth()+1) + "/" + now.getDate() + "/" + now.getFullYear() + " " + splitTime[0] + ":" + splitTime[1]);

        //     console.log(nowTime.getTime(), userTime.getTime());

        //     if ((nowTime.getTime() - userTime.getTime()) <= 60000 && (nowTime.getTime() - userTime.getTime()) >= 0)
        //         console.log("passed");
        //     else if (nowTime.getHours() == 0 && nowTime.getMinutes() == 0 && userTime.getHours() == 23 && userTime.getMinutes() == 59)
        //         console.log("passed");
        //     else
        //         console.log("failed");
        // });

        

        await pool.end();

    } catch (e) {
        console.error('Error on get Schedule:', e);
    }
}

// getScheduleList();

const scheduleMail = async (Mail, FullName, spiderUrl) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: 'false',
        auth: {
            user: 'cuong.lejoseph@hcmut.edu.vn',
            pass: 'ghou nbif ofvn xmno'
        }
    });
    
    const mailOptions = {
        from: {
            name: 'Edu Crawler Server',
            address: 'cuong.lejoseph@hcmut.edu.vn'
        },
        to: [Mail],
        subject: "Your spider is running",
        text: `Hi ${FullName}, your spider ${spiderUrl} is running`,
    
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email has been sent!');
        console.log(`Send time: ${Date()}`)
    }
    catch (e) {
        console.log(e);
    }
}

module.exports = getScheduleList