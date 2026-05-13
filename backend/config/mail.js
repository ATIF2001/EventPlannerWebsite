const https = require("https");
const env = require("./env");

class ResendTransport {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async verify() {
    return true;
  }

  async sendMail(options) {
    const from = options?.from || env.resendFrom || env.mailFrom;
    const to = Array.isArray(options?.to) ? options.to : [options?.to].filter(Boolean);

    if (!from) {
      throw new Error("Missing sender email. Set RESEND_FROM or MAIL_FROM.");
    }
    if (!to.length) {
      throw new Error("Missing recipient email.");
    }

    const payload = {
      from,
      to,
      subject: options?.subject || "",
      html: options?.html,
      text: options?.text,
      reply_to: options?.replyTo,
      headers: options?.headers,
    };

    const data = JSON.stringify(payload);

    const responseBody = await new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: "api.resend.com",
          path: "/emails",
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(data),
          },
        },
        (res) => {
          let body = "";
          res.on("data", (chunk) => {
            body += chunk;
          });
          res.on("end", () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(body);
            } else {
              reject(new Error(`Resend API error ${res.statusCode}: ${body}`));
            }
          });
        }
      );

      req.on("error", reject);
      req.write(data);
      req.end();
    });

    const parsed = JSON.parse(responseBody || "{}");
    return {
      accepted: to,
      rejected: [],
      response: "queued",
      messageId: parsed.id,
      id: parsed.id,
    };
  }
}

function getTransporter() {
  if (!env.resendApiKey) {
    return null;
  }

  return new ResendTransport(env.resendApiKey);
}

module.exports = { getTransporter };
