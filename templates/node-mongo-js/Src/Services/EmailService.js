import nodeMailer from "nodemailer";
import { CustomErrorHandler } from "../Utils";
import { SMTP_HOST, SMTP_MAIL, SMTP_PASS, SMTP_PORT, SMTP_SERVICE } from "../../Config";
import hbs from "nodemailer-express-handlebars";
import path from "path";

const EmailService = async (options) => {
    try {
        const transporter = nodeMailer.createTransport({
            host: SMTP_HOST,
            port: Number(SMTP_PORT) || 587,
            secure: Number(SMTP_PORT) === 465,
            auth: {
                user: SMTP_MAIL,
                pass: SMTP_PASS,
            },
        });

        if (options.templateName) {
            const handlerbarsOption = {
                viewEngine: {
                    extName: ".html",
                    partialsDir: path.resolve("./Src/Templates"),
                    defaultLayout: false,
                },
                viewPath: path.resolve("./Src/Templates"),
                extName: ".handlebars",
            };
            transporter.use("compile", hbs(handlerbarsOption));
        }

        const mailOptions = {
            from: `${process.env.SMTP_FROM_NAME || "App"} <${SMTP_MAIL}>`,
            to: options.to,
            subject: options.subject,
            text: options.message || options.text,
            html: options.html,
        };

        if (options.templateName) {
            mailOptions.template = options.templateName;
            mailOptions.context = options.context;
        }

        const sendEmail = await transporter.sendMail(mailOptions);
        return sendEmail;
    } catch (error) {
        return new CustomErrorHandler(error.message, 500);
    }
};

export default EmailService;
