// // How to Use :

// const mailer = require("./mailer");
// await mailer(["email@hiascs.com", "email@hiascs.com"]);

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		// from google smtp ,
		user: "techfest@opju.ac.in",
		pass: "goyw scee bzxo dflo", // from app passkeys
	},
});


async function makeMessage(recieversList) {
	try {

		const message = {

			from: '"UpStairs" <admin@upstairs.com>', // sender address

			to: recieversList, // list of receivers

			subject: "Your Email and password", // Subject line

			// text: This invitation is sent by ${user.userName}, // plain text body
			//     or
			html: `<b>This is sent by </b>
			<p>He/she wants you to join his/her team in Technorollix 2k24's event ${event.eventName} hosted by O.P. Jindal University Raigarh, Chhattisgarh</p>
			<h1><a href="http://technorollix.opju.ac.in">Invitation Link</a></h1>
			<h3>Thank you</h3>
			`, // html body

			// attachments: [
			// 	{
			// 		filename: "Text.txt",
			// 		path: "./new.txt",
			// 	},
			// ],
		};

		return message;
	} catch (error) {
		return "error"
	}
}

// async..await is not allowed in global scope, must use a wrapper
async function main(listOfRecievers) {
	try {
        console.log(listOfRecievers);
		// send mail with defined transport object
		let message = await makeMessage(listOfRecievers);
		const info = await transporter.sendMail(message, (err, info) => {
			if (err) {
				console.log(err);
			} else {
				console.log("Message sent: %s", info.messageId);
			}
		});
		return info;
	} catch (error) {
		console.log(error);
		return "Error Occured";
	}
}

module.exports = main;