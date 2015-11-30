'use strict';

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'yandex',
    auth: {
        user: 'image.editor@yandex.ru',
        pass: 'image_editor'
    }
});

var sendEmail = function (email, attachments) {
    transporter.sendMail({
        from: 'image.editor@yandex.ru',
        to: email,
        subject: 'Images',
        text: 'Below you can find attached images',
        attachments: attachments
    });
};


module.exports = {
    sendEmail: sendEmail
};
