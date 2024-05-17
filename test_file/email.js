const nodemailer = require("nodemailer");

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
    to: ["lecongcuong2604@gmail.com"],
    subject: "Your spider is running",
    text: "Hi there, your spider is running",

}

const sendMail = async (transporter, mailOptions) => {
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email has been sent!');
        console.log(`Send time: ${Date()}`)
    }
    catch (e) {
        console.log(e);
    }
}

sendMail(transporter, mailOptions);

// // async..await is not allowed in global scope, must use a wrapper
// async function main() {
//   // send mail with defined transport object
//   const info = await transporter.sendMail({
//     from: '"Leone Wyman 👻" <leone63@ethereal.email>', // sender address
//     to: "lecongcuong2604@gmail.com, cuong.lejoseph@hcmut.edu.vn", // list of receivers
//     subject: "RONALDO ✔", // Subject line
//     text: "Ronaldo?", // plain text body
//     html: "<b>RONALDOOOOOOOOOOOOOO!!!!!!!!!!!!!!!!!!!!</b>", // html body
//   });

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
// }

// main().catch(console.error);