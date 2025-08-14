import { Router } from "express";
import csrf from "csurf";

const router = Router();

const csrfProtection = csrf({ cookie: true });

// This route returns the CSRF token to the frontend.
router.get("/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

export default router;
