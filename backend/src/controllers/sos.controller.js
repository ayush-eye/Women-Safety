import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const calluser = async (req, res) =>
{
    try
    {
        const { phone } = req.body;
     
        if(!phone)
        {
            return res.status(400).json({
                success: false,
                message: "Phone number required"
            });
        }

        const sms = await client.messages.create({
            body: "🚨 SOS ALERT: The user may be in danger. Please contact immediately.",
            from: process.env.TWILIO_PHONE,
            to: phone
        });

        const call = await client.calls.create({
            to: phone,
            from: process.env.TWILIO_PHONE,
          url: "https://tiana-untransmissible-brent.ngrok-free.dev"
        });

        return res.status(200).json({
            success: true,
            callSid: call.sid
        });
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};