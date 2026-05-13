const { validationResult } = require("express-validator");
const env = require("../config/env");
const { getTransporter } = require("../config/mail");

function wasAccepted(info, recipient) {
  const accepted = Array.isArray(info?.accepted) ? info.accepted.map((r) => String(r).toLowerCase()) : [];
  return accepted.includes(String(recipient).toLowerCase());
}

function extractEmailAddress(value) {
  const input = String(value || "").trim();
  const match = input.match(/<([^>]+)>/);
  return (match ? match[1] : input).trim();
}

async function submitContactForm(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const { name, phone, email, message } = req.body;
    const transporter = getTransporter();
    const senderEmail = env.mailFrom || env.mailUser || extractEmailAddress(env.resendFrom);
    const fromHeader = env.resendFrom || `MK4 Events <${senderEmail}>`;
    const cleanName = String(name || "").replace(/[<>"']/g, "").trim();
    const cleanMessage = String(message || "").trim();
    const cleanPhone = String(phone || "").trim();
    const cleanEmail = String(email || "").trim();

    if (!transporter) {
      return res.status(500).json({ message: "Mail server is not configured" });
    }

    await transporter.verify();

    const adminMailInfo = await transporter.sendMail({
      from: fromHeader,
      sender: senderEmail,
      to: env.contactInboxEmail,
      replyTo: cleanEmail,
      envelope: {
        from: senderEmail,
        to: [env.contactInboxEmail],
      },
      subject: `New Inquiry: ${cleanName}`,
      text: `New inquiry received\n\nName: ${cleanName}\nPhone: ${cleanPhone}\nEmail: ${cleanEmail}\n\nMessage:\n${cleanMessage}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${cleanName}</p>
        <p><strong>Phone:</strong> ${cleanPhone}</p>
        <p><strong>Email:</strong> ${cleanEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${cleanMessage.replace(/\n/g, "<br/>")}</p>
      `,
      headers: {
        "X-Auto-Response-Suppress": "All",
        "Auto-Submitted": "auto-generated",
        "X-Entity-Ref-ID": `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      },
    });

    if (!wasAccepted(adminMailInfo, env.contactInboxEmail)) {
      console.error("Admin email not accepted:", {
        accepted: adminMailInfo?.accepted,
        rejected: adminMailInfo?.rejected,
        response: adminMailInfo?.response,
      });
      return res.status(502).json({ message: "Failed to deliver inquiry email" });
    }
    console.log("Admin email accepted by SMTP:", {
      to: env.contactInboxEmail,
      accepted: adminMailInfo?.accepted,
      rejected: adminMailInfo?.rejected,
      response: adminMailInfo?.response,
      messageId: adminMailInfo?.messageId,
    });

    let confirmationSent = false;
    try {
      const confirmationInfo = await transporter.sendMail({
        from: fromHeader,
        sender: senderEmail,
        to: cleanEmail,
        replyTo: env.contactInboxEmail,
        envelope: {
          from: senderEmail,
          to: [cleanEmail],
        },
        subject: "We received your message - MK4 Events",
        text: `Hi ${cleanName},\n\nThank you for contacting MK4 Events.\nWe received your inquiry and our team will reply soon.\n\nReference details:\nPhone: ${cleanPhone}\nEmail: ${cleanEmail}\n\nBest regards,\nMK4 Events`,
        html: `
          <p>Hi ${cleanName},</p>
          <p>Thank you for contacting <strong>MK4 Events</strong>.</p>
          <p>We received your inquiry and our team will reply soon.</p>
          <p><strong>Reference details:</strong><br/>Phone: ${cleanPhone}<br/>Email: ${cleanEmail}</p>
          <p>Best regards,<br/>MK4 Events</p>
        `,
        headers: {
          "X-Auto-Response-Suppress": "All",
          "Auto-Submitted": "auto-generated",
          "List-Unsubscribe": `<mailto:${env.contactInboxEmail}?subject=unsubscribe>`,
        },
      });

      if (!wasAccepted(confirmationInfo, cleanEmail)) {
        console.error("Confirmation email not accepted:", {
          accepted: confirmationInfo?.accepted,
          rejected: confirmationInfo?.rejected,
          response: confirmationInfo?.response,
          recipient: cleanEmail,
        });
      } else {
        confirmationSent = true;
        console.log("Confirmation email accepted by SMTP:", {
          to: cleanEmail,
          accepted: confirmationInfo?.accepted,
          rejected: confirmationInfo?.rejected,
          response: confirmationInfo?.response,
          messageId: confirmationInfo?.messageId,
        });
      }
    } catch (confirmationError) {
      console.error("Confirmation email failed:", confirmationError.message);
    }

    return res.status(201).json({
      message: confirmationSent
        ? "Message sent successfully. Please check your email for confirmation. We have received your inquiry."
        : "Message sent successfully. We have received your inquiry.",
      confirmationSent,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { submitContactForm };
