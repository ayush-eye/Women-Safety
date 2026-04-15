

import twilio from "twilio";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

let contacts = [];
let currentIndex = 0;
let userName = "";
let lat ="";
let lng = "";


const callNextContact = async () =>
{
    if(currentIndex >= contacts.length)
    {
        console.log("❌ No emergency contact answered.");
        return;
    }

    const phone = contacts[currentIndex].trim();

    console.log(`📞 Attempting SOS Call [${currentIndex + 1}/${contacts.length}]: ${phone} from ${process.env.TWILIO_PHONE}`);

    try {
        await client.calls.create({
            to: phone,
            from: process.env.TWILIO_PHONE,
            url: `${process.env.BASE_URL}/voice?name=${encodeURIComponent(userName)}`,
            statusCallback: `${process.env.BASE_URL}/api/sos/call-status`,
            statusCallbackEvent:["initiated","ringing","answered","completed"],
            statusCallbackMethod:"POST"
        });
        console.log(`✅ Call initiated successfully to ${phone}`);
    } catch (err) {
        console.error(`❌ Twilio Call Failed to ${phone}:`, err.message);
        // If it's an unverified number error, try the next one automatically
        currentIndex++;
        await callNextContact();
    }
};


export const calluser = async (req, res) =>
{
    try
    {
        const user = await User.findById(req.user.id);
        if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
        }

        console.log(`SOS triggered for user ID: ${req.user.id}, found ${user.emergency_contacts?.length || 0} contacts.`);
        contacts = user.emergency_contacts?.map(c => c.contact) || [];
        userName = user.name || "The user";
        currentIndex = 0;

        if(!contacts || contacts.length === 0)
        {
            return res.status(400).json({
                success:false,
                message:"No emergency contacts found in your profile. Please add them in the profile section."
            });
        }

        // send SMS to all contacts
        console.log("Sending SMS to contacts...");
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
        console.error("SOS Trigger Error:", error.message);
        return res.status(500).json({
            success:false,
            message: error.message || "An internal error occurred while triggering SOS. Check backend logs."
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