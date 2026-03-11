// import twilio from "twilio";
// import dotenv from "dotenv";

// dotenv.config();

// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// export const calluser = async (req, res) =>
// {
//     try
//     {
       
//         const { phone } = req.body;
//         const name = req.user.name || "The user";
         
     
//         if(!phone)
//         {
//             return res.status(400).json({
//                 success: false,
//                 message: "Phone number required"
//             });
//         }

//         const sms = await client.messages.create({
//             body: `🚨 SOS ALERT: ${name} may be in danger. Please contact immediately.`,
//             from: process.env.TWILIO_PHONE,
//             to: phone
//         });

//         const call = await client.calls.create({
//             to: phone,
//             from: process.env.TWILIO_PHONE,
//           url: `https://tiana-untransmissible-brent.ngrok-free.dev/voice?name=${encodeURIComponent(name)}`
//         });

//         return res.status(200).json({
//             success: true,
//             callSid: call.sid
//         });
//     }
//     catch(error)
//     {
//         return res.status(500).json({
//             success: false,
//             error: error.message
//         });
//     }
// };

import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

let contacts = [];
let currentIndex = 0;
let userName = "";


const callNextContact = async () =>
{
    if(currentIndex >= contacts.length)
    {
        console.log("❌ No emergency contact answered.");
        return;
    }

    const phone = contacts[currentIndex];

    console.log("📞 Calling:", phone);

    await client.calls.create({
        to: phone,
        from: process.env.TWILIO_PHONE,
        url: `https://tiana-untransmissible-brent.ngrok-free.dev/voice?name=${encodeURIComponent(userName)}`,
        statusCallback: `https://tiana-untransmissible-brent.ngrok-free.dev/api/sos/call-status`,
        statusCallbackEvent:["initiated","ringing","answered","completed"],
        statusCallbackMethod:"POST"
    });
};


export const calluser = async (req, res) =>
{
    try
    {
        contacts = req.body.phones;   // array of emergency numbers
        userName = req.user.name || "The user";
        currentIndex = 0;

        if(!contacts || contacts.length === 0)
        {
            return res.status(400).json({
                success:false,
                message:"Emergency contacts required"
            });
        }

        // send SMS to all contacts
        for(const phone of contacts)
        {
            await client.messages.create({
                body:`🚨 SOS ALERT: ${userName} may be in danger. Please contact immediately.`,
                from:process.env.TWILIO_PHONE,
                to:phone
            });
        }

        await callNextContact();

        return res.status(200).json({
            success:true,
            message:"Emergency calling started"
        });

    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            error:error.message
        });
    }
};

export const callStatus = async (req,res)=>
{
    const status = req.body.CallStatus;

    console.log("Call status:", status);

    if(status === "answered")
    {
        console.log("✅ Someone answered the SOS call.");
        return res.sendStatus(200);
    }

    if(status === "no-answer")
    {
        const answeredBy = req.body.AnsweredBy;

        if(!answeredBy)
        {
            console.log("❌ Not answered. Calling next contact...");
            currentIndex++;
            await callNextContact();
        }
    }

    res.sendStatus(200);
};