/**
 * Email templates matching Jackie Peanuts design
 * Colors: #5C3A21 (dark brown), #F5E6C8 (cream), #D4A017 (gold)
 */

const BRAND_COLOR = "#5C3A21";
const ACCENT_COLOR = "#F5E6C8";
const GOLD_COLOR = "#D4A017";

export interface OrderEmailData {
  name: string;
  email: string;
  phone: string;
  items: Array<{
    productName: string;
    variant: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: string | number;
  notes?: string | null;
  orderId: number;
}

export interface WholesaleEmailData {
  name: string;
  email: string;
  phone: string;
  company?: string | null;
  message: string;
}

export interface SubscriberEmailData {
  email: string;
  name?: string | null;
}

export interface BroadcastEmailData {
  emails: string[];
  subject: string;
  message: string;
}

function emailHeader(title: string = "The Nutty Universe") {
  return `
    <div style="background:${BRAND_COLOR};color:${ACCENT_COLOR};padding:20px;text-align:center;">
      <h1 style="margin:0;font-size:28px;font-weight:bold;">Jackie Peanuts</h1>
      <p style="margin:5px 0;color:${GOLD_COLOR};font-size:14px;">${title}</p>
    </div>
  `;
}

function emailFooter() {
  return `
    <div style="background:${ACCENT_COLOR};padding:15px;text-align:center;font-size:12px;color:${BRAND_COLOR};">
      <p style="margin:5px 0;"><strong>Jackie Peanuts</strong></p>
      <p style="margin:3px 0;">📧 jackiepeanuts.ke@gmail.com | 📱 0713962358</p>
      <p style="margin:3px 0;">Instagram: @Jackiepeanuts.ke | TikTok: @Jackiepeanuts</p>
    </div>
  `;
}

export function orderEmailTemplate(data: OrderEmailData): string {
  const itemsHtml = data.items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px;border:1px solid #ddd;text-align:left;">${item.productName}</td>
          <td style="padding:10px;border:1px solid #ddd;text-align:center;">${item.variant}</td>
          <td style="padding:10px;border:1px solid #ddd;text-align:center;">${item.quantity}</td>
          <td style="padding:10px;border:1px solid #ddd;text-align:right;">KES ${item.price.toLocaleString()}</td>
        </tr>
      `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f5f5f5;">
      <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #ddd;">
        ${emailHeader()}
        
        <div style="padding:20px;">
          <h2 style="color:${BRAND_COLOR};margin-top:0;">New Order #${data.orderId}</h2>
          
          <div style="background:#f9f9f9;padding:15px;border-radius:5px;margin:15px 0;">
            <p style="margin:8px 0;"><strong>Customer Name:</strong> ${data.name}</p>
            <p style="margin:8px 0;"><strong>Email:</strong> ${data.email}</p>
            <p style="margin:8px 0;"><strong>Phone:</strong> ${data.phone}</p>
            ${data.notes ? `<p style="margin:8px 0;"><strong>Special Notes:</strong> ${data.notes}</p>` : ""}
          </div>

          <h3 style="color:${BRAND_COLOR};margin-top:20px;">Order Items</h3>
          <table style="width:100%;border-collapse:collapse;margin:10px 0;">
            <thead>
              <tr style="background:${ACCENT_COLOR};">
                <th style="padding:10px;border:1px solid #ddd;text-align:left;color:${BRAND_COLOR};">Product</th>
                <th style="padding:10px;border:1px solid #ddd;text-align:center;color:${BRAND_COLOR};">Variant</th>
                <th style="padding:10px;border:1px solid #ddd;text-align:center;color:${BRAND_COLOR};">Qty</th>
                <th style="padding:10px;border:1px solid #ddd;text-align:right;color:${BRAND_COLOR};">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="background:${ACCENT_COLOR};padding:15px;border-radius:5px;margin:15px 0;text-align:right;">
            <p style="margin:0;font-size:18px;color:${BRAND_COLOR};"><strong>Total Amount: KES ${typeof data.totalAmount === "number" ? data.totalAmount.toLocaleString() : data.totalAmount}</strong></p>
          </div>
        </div>

        ${emailFooter()}
      </div>
    </body>
    </html>
  `;
}

export function wholesaleEmailTemplate(data: WholesaleEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f5f5f5;">
      <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #ddd;">
        ${emailHeader("Wholesale Inquiry")}
        
        <div style="padding:20px;">
          <h2 style="color:${BRAND_COLOR};margin-top:0;">New Wholesale Inquiry</h2>
          
          <div style="background:#f9f9f9;padding:15px;border-radius:5px;margin:15px 0;">
            <p style="margin:8px 0;"><strong>Name:</strong> ${data.name}</p>
            <p style="margin:8px 0;"><strong>Email:</strong> ${data.email}</p>
            <p style="margin:8px 0;"><strong>Phone:</strong> ${data.phone}</p>
            ${data.company ? `<p style="margin:8px 0;"><strong>Company:</strong> ${data.company}</p>` : ""}
          </div>

          <h3 style="color:${BRAND_COLOR};">Message</h3>
          <div style="background:#f9f9f9;padding:15px;border-radius:5px;border-left:4px solid ${GOLD_COLOR};">
            <p style="margin:0;line-height:1.6;white-space:pre-wrap;">${data.message}</p>
          </div>
        </div>

        ${emailFooter()}
      </div>
    </body>
    </html>
  `;
}

export function subscriberEmailTemplate(data: SubscriberEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f5f5f5;">
      <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #ddd;">
        ${emailHeader("New Subscriber")}
        
        <div style="padding:20px;">
          <h2 style="color:${BRAND_COLOR};margin-top:0;">New Newsletter Subscriber</h2>
          
          <div style="background:#f9f9f9;padding:15px;border-radius:5px;margin:15px 0;">
            <p style="margin:8px 0;"><strong>Email:</strong> ${data.email}</p>
            ${data.name ? `<p style="margin:8px 0;"><strong>Name:</strong> ${data.name}</p>` : ""}
          </div>

          <p style="color:#666;font-size:13px;margin:15px 0;">
            ✓ This person subscribed via the Jackie Peanuts website newsletter.
          </p>
        </div>

        ${emailFooter()}
      </div>
    </body>
    </html>
  `;
}

export function broadcastEmailTemplate(message: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f5f5f5;">
      <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #ddd;">
        ${emailHeader()}
        
        <div style="padding:20px;line-height:1.6;">
          ${message.replace(/\n/g, "<br>")}
        </div>

        ${emailFooter()}
      </div>
    </body>
    </html>
  `;
}
