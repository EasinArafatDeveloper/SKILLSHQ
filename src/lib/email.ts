import nodemailer from "nodemailer"

const EMAIL_USER = process.env.EMAIL_USER || ""
const EMAIL_PASS = (process.env.EMAIL_PASS || "").replace(/\s/g, "")

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
})

export interface OrderEmailData {
  name: string
  email: string
  phone: string
  orderId: string
  transactionId: string
  amount: string
  paymentMethod: string
}

export interface ApprovedEmailData {
  name: string
  email: string
  phone: string
  orderId: string
  transactionId: string
  amount: string
  telegramLink?: string
}

// ===== ORDER CONFIRMATION EMAIL =====
export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const html = getOrderConfirmationHTML(data)

  try {
    await transporter.sendMail({
      from: `"SkillsHQ" <${EMAIL_USER}>`,
      to: data.email,
      subject: `✅ অর্ডার কনফার্মড! - SkillsHQ Premium Bundle`,
      html,
    })
    console.log(`📧 Order confirmation sent to ${data.email}`)
    return true
  } catch (err) {
    console.error("Failed to send order email:", err)
    return false
  }
}

// ===== APPROVAL + LINKS EMAIL =====
export async function sendApprovalEmail(data: ApprovedEmailData) {
  const html = getApprovalHTML(data)

  try {
    await transporter.sendMail({
      from: `"SkillsHQ" <${EMAIL_USER}>`,
      to: data.email,
      subject: `🎉 আপনার কোর্স আনলক হয়েছে! - SkillsHQ`,
      html,
    })
    console.log(`📧 Approval email sent to ${data.email}`)
    return true
  } catch (err) {
    console.error("Failed to send approval email:", err)
    return false
  }
}

// ===== ORDER CONFIRMATION TEMPLATE =====
function getOrderConfirmationHTML(d: OrderEmailData) {
  const orderDate = new Date().toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, sans-serif; background: #f1f5f9; }
    .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #f59e0b, #d97706); padding: 32px 24px; text-align: center; }
    .header h1 { color: #fff; margin: 0; font-size: 22px; font-weight: 800; }
    .header p { color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 13px; }
    .body { padding: 28px 24px; }
    .status-badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-bottom: 16px; }
    .section { margin-bottom: 20px; }
    .section h3 { font-size: 13px; color: #64748b; text-transform: uppercase; margin: 0 0 10px; letter-spacing: 0.5px; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
    .info-row .label { color: #64748b; }
    .info-row .value { color: #1e293b; font-weight: 600; }
    .highlight { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px; text-align: center; margin: 20px 0; }
    .highlight .amount { font-size: 28px; font-weight: 800; color: #059669; }
    .btn { display: inline-block; background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 14px; margin-top: 12px; }
    .footer { background: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer p { margin: 4px 0; font-size: 11px; color: #94a3b8; }
  </style>
</head>
<body style="padding: 20px;">
  <div class="container">
    <div class="header">
      <h1>🎓 SkillsHQ</h1>
      <p>Premium Course Bundle - অর্ডার কনফার্মেশন</p>
    </div>
    <div class="body">
      <div class="status-badge">⏳ পেমেন্ট ভেরিফিকেশন পেন্ডিং</div>
      <p style="font-size:14px; color:#334155; line-height:1.6; margin-top:8px;">
        প্রিয় <strong>${d.name}</strong>,<br><br>
        আপনার অর্ডারটি সফলভাবে জমা হয়েছে! আমাদের টিম আপনার পেমেন্ট ভেরিফাই করছে।
        ভেরিফিকেশন কমপ্লিট হলে আপনার ড্যাশবোর্ডে কোর্স লিংক পেয়ে যাবেন।
      </p>

      <div class="section">
        <h3>📋 অর্ডার তথ্য</h3>
        <div class="info-row"><span class="label">অর্ডার আইডি</span><span class="value">#${d.orderId}</span></div>
        <div class="info-row"><span class="label">তারিখ</span><span class="value">${orderDate}</span></div>
        <div class="info-row"><span class="label">ইমেইল</span><span class="value">${d.email}</span></div>
        <div class="info-row"><span class="label">ফোন</span><span class="value">${d.phone}</span></div>
      </div>

      <div class="section">
        <h3>💳 পেমেন্ট তথ্য</h3>
        <div class="info-row"><span class="label">পেমেন্ট মেথড</span><span class="value">${d.paymentMethod === "bkash" ? "bKash" : "Nagad"}</span></div>
        <div class="info-row"><span class="label">ট্রানজেকশন আইডি</span><span class="value" style="font-family:monospace;">${d.transactionId}</span></div>
      </div>

      <div class="highlight">
        <p style="margin:0;font-size:12px;color:#64748b;">মোট পরিশোধিত</p>
        <p class="amount">${d.amount}</p>
      </div>

      <div style="text-align:center;">
        <a href="https://skillshq.vercel.app/dashboard" class="btn" style="color:#fff;">🔗 ড্যাশবোর্ডে যান</a>
        <p style="font-size:11px;color:#94a3b8;margin-top:10px;">আপনার ইমেইল বা ফোন নম্বর দিয়ে লগইন করুন</p>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} SkillsHQ. All rights reserved.</p>
      <p>Premium Learning Hub | Bangladesh</p>
      <p style="font-size:10px;color:#cbd5e1;">এই ইমেইলটি স্বয়ংক্রিয়ভাবে পাঠানো হয়েছে। অনুগ্রহ করে রিপ্লাই করবেন না।</p>
    </div>
  </div>
</body>
</html>`
}

// ===== APPROVAL + COURSE LINKS TEMPLATE =====
function getApprovalHTML(d: ApprovedEmailData) {
  return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, sans-serif; background: #f1f5f9; }
    .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #059669, #047857); padding: 32px 24px; text-align: center; }
    .header h1 { color: #fff; margin: 0; font-size: 22px; font-weight: 800; }
    .header p { color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 13px; }
    .body { padding: 28px 24px; }
    .status-badge { display: inline-block; background: #d1fae5; color: #065f46; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-bottom: 16px; }
    .section { margin-bottom: 20px; }
    .section h3 { font-size: 13px; color: #64748b; text-transform: uppercase; margin: 0 0 10px; letter-spacing: 0.5px; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
    .info-row .label { color: #64748b; }
    .info-row .value { color: #1e293b; font-weight: 600; }
    .telegram-card { background: linear-gradient(135deg, #3b82f6, #2563eb); border-radius: 12px; padding: 20px; text-align: center; margin: 16px 0; }
    .telegram-card h3 { color: #fff; margin: 0 0 6px; font-size: 15px; }
    .telegram-card p { color: rgba(255,255,255,0.85); margin: 0; font-size: 12px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #059669, #047857); color: #fff; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 14px; margin-top: 12px; }
    .btn-blue { background: linear-gradient(135deg, #fff, #f0f9ff); color: #2563eb; }
    .footer { background: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer p { margin: 4px 0; font-size: 11px; color: #94a3b8; }
    .warning { background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 12px 16px; font-size: 12px; color: #991b1b; margin-top: 16px; }
  </style>
</head>
<body style="padding: 20px;">
  <div class="container">
    <div class="header">
      <h1>🎉 অভিনন্দন!</h1>
      <p>আপনার কোর্স আনলক হয়ে গেছে!</p>
    </div>
    <div class="body">
      <div class="status-badge">✅ পেমেন্ট ভেরিফাইড - কোর্স আনলকড</div>
      <p style="font-size:14px; color:#334155; line-height:1.6; margin-top:8px;">
        প্রিয় <strong>${d.name}</strong>,<br><br>
        দারুণ খবর! আপনার পেমেন্ট ভেরিফাই করা হয়েছে এবং সকল কোর্স আপনার জন্য আনলক করে দেওয়া হয়েছে।
        নিচের লিংকে ক্লিক করে আপনার ড্যাশবোর্ড থেকে সব কোর্স অ্যাক্সেস করতে পারবেন।
      </p>

      <div class="section">
        <h3>📋 অর্ডার তথ্য</h3>
        <div class="info-row"><span class="label">অর্ডার আইডি</span><span class="value">#${d.orderId}</span></div>
        <div class="info-row"><span class="label">পরিমাণ</span><span class="value" style="color:#059669;">${d.amount}</span></div>
        <div class="info-row"><span class="label">ট্রানজেকশন আইডি</span><span class="value" style="font-family:monospace;">${d.transactionId}</span></div>
      </div>

      ${d.telegramLink ? `
      <div class="telegram-card">
        <h3>💬 টেলিগ্রাম গ্রুপে জয়েন করুন</h3>
        <p>কমিউনিটি সাপোর্ট ও আপডেটের জন্য গ্রুপে জয়েন করুন</p>
        <a href="${d.telegramLink}" class="btn btn-blue" style="color:#2563eb;margin-top:12px;">টেলিগ্রামে জয়েন করুন →</a>
      </div>` : ""}

      <div style="text-align:center;">
        <a href="https://skillshq.vercel.app/dashboard" class="btn" style="color:#fff;">🔗 আপনার ড্যাশবোর্ড খুলুন</a>
        <p style="font-size:11px;color:#94a3b8;margin-top:10px;">আপনার ইমেইল বা ফোন নম্বর দিয়ে লগইন করে সব কোর্স দেখুন</p>
      </div>

      <div class="warning">
        ⚠️ <strong>গুরুত্বপূর্ণ:</strong> প্রতিটি কোর্স লিংক শুধুমাত্র একবারই খোলা যাবে। কাউকে শেয়ার করবেন না।
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} SkillsHQ. All rights reserved.</p>
      <p>Premium Learning Hub | Bangladesh</p>
      <p style="font-size:10px;color:#cbd5e1;">এই ইমেইলটি স্বয়ংক্রিয়ভাবে পাঠানো হয়েছে। অনুগ্রহ করে রিপ্লাই করবেন না।</p>
    </div>
  </div>
</body>
</html>`
}
