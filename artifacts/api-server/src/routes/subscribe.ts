import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    res.status(400).json({ error: "Invalid email" });
    return;
  }

  if (!process.env.BEEHIIV_API_KEY) {
    res.status(500).json({ error: "BEEHIIV_API_KEY not configured" });
    return;
  }

  try {
    const response = await fetch(
      "https://api.beehiiv.com/v2/publications/pub_43609e6b-5dfc-4d3f-ad77-48488b02df50/subscriptions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: false,
          send_welcome_email: true,
          utm_source: "import-calculator",
          utm_medium: "web",
        }),
      },
    );

    const data = await response.json();
    if (response.ok) {
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ error: data });
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
