import { Webhook } from "svix"; // Make sure you have svix for webhook verification
import User from "../models/User.js"; // Import your User model

  // Clerk Webhook Handler
  export const clerkWebhooks = async (req, res) => {
    try {
      
      // Verify the webhook signature
      const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
      await webhook.verify(JSON.stringify(req.body), {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"],
      });
  
  
      const { data, type } = req.body;
    
  
      switch (type) {
        case "user.created": {
          const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            name: `${data.first_name} ${data.last_name}`,
            image: data.image_url,
            resume: ""
          };
          await User.create(userData);
          res.json({});
          break;
        }
  
        case "user.updated": {
          console.log("Updating user with data:", data);
          const userData = {
            email: data.email_addresses[0].email_address,
            name: `${data.first_name} ${data.last_name}`,
            imageUrl: data.image_url,
          };
          await User.findByIdAndUpdate(data.id, userData);
        res.json({});
          break;
        }
  
        case "user.deleted": {
          const deletedUser = await User.findByIdAndDelete(data.id);
           res.json({});
           break;
        }
  
        default:
          console.log("Unhandled event type:", type);
          return res
            .status(400)
            .json({ success: false, message: "Unhandled event type" });
      }
    } catch (error) {
      console.error("Webhook processing error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };
