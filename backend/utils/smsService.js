const twilio = require("twilio");

// Twilio credentials from .env
const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE = process.env.TWILIO_PHONE;

const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

const sendSMS = async (phone, message) => {
  if (!TWILIO_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE) {
    console.warn("SMS Service: Twilio credentials missing in .env file. SMS will not be sent.");
    return;
  }

  try {
    // Ensure the phone number starts with +91 (or let the user decide)
    // Here we prepend +91 for India as per your requirement.
    const toPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    
    await client.messages.create({
      body: message,
      from: TWILIO_PHONE,
      to: toPhone,
    });
    console.log(`SMS sent successfully to ${toPhone}`);
  } catch (error) {
    console.error(`Failed to send SMS to ${phone}:`, error);
  }
};

module.exports = sendSMS;
