# Email API Integration Guide for Render

This guide explains how to integrate the Email API service with your Render deployment to send owner notifications when users subscribe, place orders, or submit wholesale inquiries.

## Overview

The Email API service provides REST endpoints that your Render application can call to send formatted emails to the Jackie Peanuts owners. The service uses Gmail SMTP with the configured credentials and maintains the same professional email design.

## API Endpoints

All endpoints are available at: `https://your-email-api-domain.com/api/trpc/`

### 1. Send Order Notification

**Endpoint:** `POST /api/trpc/jackiePeanuts.sendOrder`

**Purpose:** Send an order notification to owners when a customer places an order.

**Request Body:**
```json
{
  "json": {
    "name": "Customer Name",
    "email": "customer@example.com",
    "phone": "0712345678",
    "items": [
      {
        "productName": "Roasted Peanuts",
        "variant": "Salted",
        "quantity": 2,
        "price": 500
      }
    ],
    "totalAmount": 1000,
    "notes": "Please deliver on Monday",
    "orderId": 12345
  }
}
```

**Response:**
```json
{
  "result": {
    "data": {
      "success": true,
      "messageId": "<message-id@gmail.com>",
      "message": "Order notification sent successfully"
    }
  }
}
```

### 2. Send Wholesale Inquiry Notification

**Endpoint:** `POST /api/trpc/jackiePeanuts.sendWholesale`

**Purpose:** Send a wholesale inquiry notification to owners.

**Request Body:**
```json
{
  "json": {
    "name": "Business Owner",
    "email": "business@example.com",
    "phone": "0712345678",
    "company": "ABC Retail",
    "message": "Interested in bulk peanut orders for our stores"
  }
}
```

**Response:**
```json
{
  "result": {
    "data": {
      "success": true,
      "messageId": "<message-id@gmail.com>",
      "message": "Wholesale inquiry notification sent successfully"
    }
  }
}
```

### 3. Send Subscriber Notification

**Endpoint:** `POST /api/trpc/jackiePeanuts.sendSubscriber`

**Purpose:** Send a notification when a new subscriber joins the newsletter.

**Request Body:**
```json
{
  "json": {
    "email": "subscriber@example.com",
    "name": "John Doe"
  }
}
```

**Response:**
```json
{
  "result": {
    "data": {
      "success": true,
      "messageId": "<message-id@gmail.com>",
      "message": "Subscriber notification sent successfully"
    }
  }
}
```

### 4. Send Broadcast Email

**Endpoint:** `POST /api/trpc/jackiePeanuts.sendBroadcast`

**Purpose:** Send a broadcast email to multiple recipients.

**Request Body:**
```json
{
  "json": {
    "emails": ["user1@example.com", "user2@example.com"],
    "subject": "New Product Launch",
    "message": "We're excited to announce our new product line!"
  }
}
```

**Response:**
```json
{
  "result": {
    "data": {
      "success": true,
      "messageId": "<message-id@gmail.com>",
      "sentCount": 2,
      "message": "Broadcast email sent to 2 recipients"
    }
  }
}
```

## Integration Examples

### JavaScript/Node.js

```javascript
// Send order notification
async function notifyOrderToOwners(orderData) {
  try {
    const response = await fetch(
      'https://your-email-api-domain.com/api/trpc/jackiePeanuts.sendOrder',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          json: {
            name: orderData.customerName,
            email: orderData.customerEmail,
            phone: orderData.customerPhone,
            items: orderData.items,
            totalAmount: orderData.totalAmount,
            notes: orderData.notes,
            orderId: orderData.orderId
          }
        })
      }
    );

    const result = await response.json();
    if (result.result?.data?.success) {
      console.log('Order notification sent successfully');
    } else {
      console.error('Failed to send order notification');
    }
  } catch (error) {
    console.error('Error sending order notification:', error);
  }
}

// Send subscriber notification
async function notifyNewSubscriber(email, name) {
  try {
    const response = await fetch(
      'https://your-email-api-domain.com/api/trpc/jackiePeanuts.sendSubscriber',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          json: { email, name }
        })
      }
    );

    const result = await response.json();
    return result.result?.data?.success || false;
  } catch (error) {
    console.error('Error sending subscriber notification:', error);
    return false;
  }
}
```

### Python

```python
import requests
import json

def send_order_notification(order_data):
    url = "https://your-email-api-domain.com/api/trpc/jackiePeanuts.sendOrder"
    
    payload = {
        "json": {
            "name": order_data["customer_name"],
            "email": order_data["customer_email"],
            "phone": order_data["customer_phone"],
            "items": order_data["items"],
            "totalAmount": order_data["total_amount"],
            "notes": order_data.get("notes"),
            "orderId": order_data["order_id"]
        }
    }
    
    headers = {"Content-Type": "application/json"}
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        result = response.json()
        return result.get("result", {}).get("data", {}).get("success", False)
    except Exception as e:
        print(f"Error sending order notification: {e}")
        return False

def send_subscriber_notification(email, name=None):
    url = "https://your-email-api-domain.com/api/trpc/jackiePeanuts.sendSubscriber"
    
    payload = {
        "json": {
            "email": email,
            "name": name
        }
    }
    
    headers = {"Content-Type": "application/json"}
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        result = response.json()
        return result.get("result", {}).get("data", {}).get("success", False)
    except Exception as e:
        print(f"Error sending subscriber notification: {e}")
        return False
```

## Email Design

All emails maintain the Jackie Peanuts brand design with:

- **Header:** Brown background (#5C3A21) with cream text (#F5E6C8)
- **Brand:** "Jackie Peanuts" with "The Nutty Universe" tagline
- **Content:** Professional formatting with clear information hierarchy
- **Footer:** Contact information and social media links

### Email Templates

#### Order Email
- Customer information (name, email, phone)
- Order items in a formatted table
- Total amount highlighted
- Special notes (if provided)

#### Wholesale Email
- Inquiry details (name, email, phone, company)
- Full message content
- Professional formatting

#### Subscriber Email
- Subscriber email and name
- Confirmation that they subscribed via the website

#### Broadcast Email
- Custom subject and message
- Maintains brand consistency

## Deployment Steps

### 1. Set Environment Variables

On Render, set these environment variables:

```
GMAIL_USER=unitedkindredalliance@gmail.com
GMAIL_APP_PASSWORD=ewlrcotqydkcnuic
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=your-oauth-url
```

### 2. Deploy the Service

Push the email API to Render:

```bash
git push render main
```

### 3. Get Your API URL

After deployment, your Email API will be available at:
```
https://your-email-api-service.onrender.com
```

### 4. Update Your Render App

In your main Render application, update the email service URL to point to your Email API service.

## Error Handling

All endpoints return errors in this format:

```json
{
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Specific error message"
  }
}
```

Common errors:

- **Invalid email format:** Check that email addresses are valid
- **Missing required fields:** Ensure all required fields are provided
- **Gmail authentication failed:** Verify credentials are correct
- **Network timeout:** Retry the request

## Testing

You can test the endpoints using curl:

```bash
# Test subscriber notification
curl -X POST https://your-email-api-domain.com/api/trpc/jackiePeanuts.sendSubscriber \
  -H "Content-Type: application/json" \
  -d '{
    "json": {
      "email": "test@example.com",
      "name": "Test User"
    }
  }'

# Test order notification
curl -X POST https://your-email-api-domain.com/api/trpc/jackiePeanuts.sendOrder \
  -H "Content-Type: application/json" \
  -d '{
    "json": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "0712345678",
      "items": [{"productName": "Peanuts", "variant": "Salted", "quantity": 1, "price": 500}],
      "totalAmount": 500,
      "orderId": 1
    }
  }'
```

## Support

For issues or questions about the Email API service, check the logs on Render or contact the development team.

## Next Steps

1. Deploy the Email API service to Render
2. Get the service URL
3. Update your main application to use the Email API endpoints
4. Test each endpoint with sample data
5. Deploy your main application with the updated email service URL
