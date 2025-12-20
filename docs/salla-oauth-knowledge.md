# Salla OAuth 2.0 Integration - Complete LLM Knowledge Guide

This document provides comprehensive knowledge about Salla's OAuth 2.0 implementation for building integrations with the Salla e-commerce platform.

## Table of Contents

1. [Introduction](#introduction)
2. [OAuth 2.0 Modes](#oauth-20-modes)
3. [Prerequisites](#prerequisites)
4. [Custom Mode OAuth Flow](#custom-mode-oauth-flow)
5. [Easy Mode Webhook Flow](#easy-mode-webhook-flow)
6. [Token Management](#token-management)
7. [API Usage](#api-usage)
8. [Webhook Events](#webhook-events)
9. [Security Considerations](#security-considerations)
10. [Error Handling](#error-handling)
11. [Code Examples](#code-examples)

---

## Introduction

**Salla** is a leading Saudi e-commerce platform that allows merchants to create online stores. The Salla API enables third-party applications to integrate with Salla stores using OAuth 2.0 for secure authentication and authorization.

### Key Concepts

- **Salla Partner Portal**: https://salla.partners - Where developers create and manage their apps
- **Salla App Store**: https://apps.salla.sa - Where merchants discover and install apps
- **Base API URL**: `https://api.salla.dev/admin/v2/`
- **OAuth Authorization URL**: `https://accounts.salla.sa/oauth2/auth`
- **OAuth Token URL**: `https://accounts.salla.sa/oauth2/token`
- **User Info URL**: `https://accounts.salla.sa/oauth2/user/info`

---

## OAuth 2.0 Modes

Salla supports two OAuth implementation modes:

### 1. Easy Mode (Recommended by Salla)

- **Flow**: Webhook-based token delivery
- **Best for**: Simple integrations, quick setup
- **How it works**: 
  1. Merchant installs app from Salla App Store
  2. Salla sends `app.store.authorize` webhook event with access token
  3. App saves token and is immediately connected
- **Pros**: Simpler, no redirect handling needed
- **Cons**: Requires public webhook endpoint

### 2. Custom Mode

- **Flow**: Standard OAuth 2.0 authorization code flow
- **Best for**: Advanced integrations, custom authentication flows
- **How it works**:
  1. App redirects merchant to Salla authorization page
  2. Merchant approves permissions
  3. Salla redirects back with authorization code
  4. App exchanges code for access token
- **Pros**: Standard OAuth flow, more control
- **Cons**: More complex implementation

---

## Prerequisites

Before starting integration:

1. **Create a Salla Partner Account**: Sign up at https://salla.partners
2. **Create an App**: In the Partner Portal, create your application
3. **Get Credentials**:
   - **Client ID** (App ID): e.g., `1311508470xxx`
   - **Client Secret**: e.g., `362985662xxx`
4. **Configure Callback URL**: Set your OAuth redirect URI
5. **Set Webhook URL**: For Easy Mode or webhook events
6. **Create Demo Store**: Use https://salla.dev/blog/how-to-test-your-app-using-salla-demo-stores/

### Required Scopes

When requesting authorization, include the `offline_access` scope to receive a refresh token:

```
scope=offline_access
```

Additional scopes depend on your app's needs (e.g., `read:products`, `write:orders`).

---

## Custom Mode OAuth Flow

### Step 1: Generate Authorization URL

Redirect the merchant to Salla's authorization endpoint:

```
https://accounts.salla.sa/oauth2/auth?client_id={CLIENT_ID}&response_type=code&redirect_uri={REDIRECT_URI}&scope=offline_access&state={RANDOM_STATE}
```

**Parameters:**
- `client_id`: Your app's Client ID
- `response_type`: Must be `code`
- `redirect_uri`: Your OAuth callback URL (must match Partner Portal)
- `scope`: `offline_access` (required for refresh token)
- `state`: Random string for CSRF protection

**Example:**
```typescript
const authUrl = `https://accounts.salla.sa/oauth2/auth?client_id=1311508470xxx&response_type=code&redirect_uri=https://yourapp.com/oauth/callback&scope=offline_access&state=abc123xyz`;
window.location.href = authUrl;
```

### Step 2: Handle OAuth Callback

After approval, Salla redirects to your `redirect_uri` with:

```
https://yourapp.com/oauth/callback?code={AUTHORIZATION_CODE}&scope=offline_access&state={STATE_VALUE}
```

**Extract:**
- `code`: Authorization code (single-use, short-lived)
- `state`: Verify it matches your original state
- `scope`: Granted scopes

### Step 3: Exchange Code for Access Token

Make a POST request to exchange the authorization code:

**Endpoint:** `https://accounts.salla.sa/oauth2/token`

**HTTP Method:** `POST`

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "grant_type": "authorization_code",
  "code": "{AUTHORIZATION_CODE}",
  "redirect_uri": "{REDIRECT_URI}",
  "client_id": "{CLIENT_ID}",
  "client_secret": "{CLIENT_SECRET}"
}
```

**Response (Success):**
```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "def50200...",
  "token_type": "Bearer",
  "expires_in": 31536000
}
```

**Response Fields:**
- `access_token`: Use this to authenticate API requests
- `refresh_token`: Use to get new access tokens when expired
- `expires_in`: Seconds until access token expires (in seconds, e.g., 31536000 = 1 year)
- `token_type`: Always "Bearer"

**Important:** Calculate token expiry:
```typescript
const expiresAt = new Date(Date.now() + (expires_in * 1000));
```

### Step 4: Get Store Information

Verify the connection by fetching store details:

**Endpoint:** `https://accounts.salla.sa/oauth2/user/info`

**HTTP Method:** `GET`

**Headers:**
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Response:**
```json
{
  "id": 123456,
  "name": "My Store",
  "email": "store@example.com",
  "domain": "mystore.sa",
  "logo": "https://cdn.salla.sa/logo.png",
  "merchant": {
    "id": 789,
    "name": "Merchant Name"
  }
}
```

---

## Easy Mode Webhook Flow

### Step 1: Configure Webhook URL

In the Salla Partner Portal, set your webhook URL:
```
https://yourapp.com/api/webhook/salla
```

### Step 2: Handle `app.store.authorize` Event

When a merchant installs your app, Salla sends:

**Webhook Event:**
```json
{
  "event": "app.store.authorize",
  "merchant": 123456,
  "data": {
    "access_token": "eyJhbGciOi...",
    "expires_in": 31536000,
    "refresh_token": "def50200...",
    "token_type": "Bearer"
  }
}
```

**Action:** Save the tokens immediately:
```typescript
// Pseudo-code
await saveIntegration({
  merchantId: payload.merchant,
  accessToken: payload.data.access_token,
  refreshToken: payload.data.refresh_token,
  expiresAt: new Date(Date.now() + payload.data.expires_in * 1000)
});
```

### Step 3: Verify Webhook Signature

For security, verify the webhook signature using your Client Secret:

```typescript
import crypto from 'crypto';

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return hmac === signature;
}

// Usage in webhook handler
const signature = req.headers['x-salla-signature'];
const body = JSON.stringify(req.body);
if (!verifyWebhookSignature(body, signature, CLIENT_SECRET)) {
  return res.status(401).json({ error: 'Invalid signature' });
}
```

---

## Token Management

### Access Token Lifecycle

- **Default Expiry**: 1 year (31,536,000 seconds)
- **Storage**: Store securely in database (encrypted recommended)
- **Usage**: Include in `Authorization: Bearer {token}` header

### Refresh Token Flow

When access token expires, use refresh token to get a new one:

**Endpoint:** `https://accounts.salla.sa/oauth2/token`

**HTTP Method:** `POST`

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "grant_type": "refresh_token",
  "refresh_token": "{REFRESH_TOKEN}",
  "client_id": "{CLIENT_ID}",
  "client_secret": "{CLIENT_SECRET}"
}
```

**Response:**
```json
{
  "access_token": "new_access_token_here",
  "refresh_token": "new_refresh_token_here",
  "token_type": "Bearer",
  "expires_in": 31536000
}
```

**Important Notes:**
- Always save the **new refresh token** - the old one becomes invalid
- Update `expiresAt` timestamp
- According to RFC 6819, refresh tokens should be rotated for security

**Refresh Strategy:**
```typescript
async function refreshAccessToken(currentRefreshToken: string) {
  const response = await fetch('https://accounts.salla.sa/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: currentRefreshToken,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    })
  });
  
  const data = await response.json();
  
  // Save new tokens
  await updateIntegration({
    accessToken: data.access_token,
    refreshToken: data.refresh_token, // IMPORTANT: Update this!
    expiresAt: new Date(Date.now() + data.expires_in * 1000)
  });
  
  return data.access_token;
}
```

### Proactive Token Refresh

Don't wait for token expiry - refresh proactively:

```typescript
async function getValidAccessToken() {
  const integration = await getIntegration('salla');
  const now = new Date();
  const expiresAt = new Date(integration.expiresAt);
  
  // Refresh if token expires in next 24 hours
  const hoursUntilExpiry = (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  if (hoursUntilExpiry < 24) {
    return await refreshAccessToken(integration.refreshToken);
  }
  
  return integration.accessToken;
}
```

---

## API Usage

### Making Authenticated Requests

All Salla API requests require the access token:

**Base URL:** `https://api.salla.dev/admin/v2/`

**Headers:**
```
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json
Accept: application/json
```

### Common API Endpoints

#### 1. Get Store Information
```
GET https://api.salla.dev/admin/v2/store/info
```

#### 2. List Products
```
GET https://api.salla.dev/admin/v2/products
```

#### 3. Get Orders
```
GET https://api.salla.dev/admin/v2/orders
```

#### 4. Get Customers
```
GET https://api.salla.dev/admin/v2/customers
```

#### 5. List Brands
```
GET https://api.salla.dev/admin/v2/brands
```

### Example API Request

```typescript
async function fetchProducts(accessToken: string) {
  const response = await fetch('https://api.salla.dev/admin/v2/products', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      // Token expired - refresh and retry
      const newToken = await refreshAccessToken();
      return fetchProducts(newToken);
    }
    throw new Error(`API error: ${response.status}`);
  }
  
  return await response.json();
}
```

---

## Webhook Events

Salla sends webhooks for various store events:

### Common Events

| Event | Description |
|-------|-------------|
| `app.store.authorize` | Merchant authorized your app (Easy Mode) |
| `app.installed` | App was installed on a store |
| `app.uninstalled` | App was removed from a store |
| `app.updated` | App settings were updated |
| `order.created` | New order placed |
| `order.updated` | Order status changed |
| `product.created` | New product added |
| `product.updated` | Product information changed |
| `customer.created` | New customer registered |

### Webhook Payload Structure

```json
{
  "event": "order.created",
  "merchant": 123456,
  "created_at": "2025-12-20T14:00:00Z",
  "data": {
    "id": 789,
    "status": "pending",
    "total": 150.00,
    "customer": {...},
    "items": [...]
  }
}
```

### Webhook Handler Template

```typescript
export async function POST(req: Request) {
  try {
    // 1. Verify signature
    const signature = req.headers.get('x-salla-signature');
    const body = await req.text();
    
    if (!verifyWebhookSignature(body, signature, CLIENT_SECRET)) {
      return new Response('Invalid signature', { status: 401 });
    }
    
    // 2. Parse payload
    const payload = JSON.parse(body);
    const { event, merchant, data } = payload;
    
    // 3. Process event
    switch (event) {
      case 'app.store.authorize':
        await handleStoreAuthorization(merchant, data);
        break;
      
      case 'order.created':
        await handleNewOrder(merchant, data);
        break;
      
      case 'app.uninstalled':
        await handleAppUninstall(merchant);
        break;
      
      default:
        console.log(`Unhandled event: ${event}`);
    }
    
    // 4. Acknowledge receipt
    return new Response('OK', { status: 200 });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Internal error', { status: 500 });
  }
}
```

---

## Security Considerations

### 1. Secure Token Storage

- **Never** commit tokens to version control
- **Encrypt** tokens before storing in database
- Use environment variables for Client ID/Secret
- Implement proper access controls

### 2. Webhook Signature Verification

**Always** verify webhook signatures to prevent spoofing:

```typescript
// Get signature from header
const signature = req.headers.get('x-salla-signature');

// Calculate expected signature
const expectedSignature = crypto
  .createHmac('sha256', CLIENT_SECRET)
  .update(requestBody)
  .digest('hex');

// Compare
if (signature !== expectedSignature) {
  throw new Error('Invalid webhook signature');
}
```

### 3. State Parameter (CSRF Protection)

Use cryptographically random state parameter in OAuth flow:

```typescript
import crypto from 'crypto';

const state = crypto.randomBytes(32).toString('hex');

// Store in session/database
await saveOAuthState(userId, state);

// Include in authorization URL
const authUrl = `...&state=${state}`;

// Verify on callback
const receivedState = new URL(req.url).searchParams.get('state');
const storedState = await getOAuthState(userId);

if (receivedState !== storedState) {
  throw new Error('Invalid state parameter');
}
```

### 4. IP Whitelisting

Salla supports IP whitelisting for additional security. Configure in Partner Portal:
- https://salla.dev/blog/secure-your-apps-with-the-trusted-ip-address-now/

### 5. HTTPS Only

- All OAuth redirects must use HTTPS
- Webhook endpoints must use HTTPS
- Never transmit tokens over HTTP

---

## Error Handling

### OAuth Errors

**Error Response Format:**
```json
{
  "error": "invalid_grant",
  "error_description": "The provided authorization grant is invalid"
}
```

**Common OAuth Errors:**

| Error | Meaning | Solution |
|-------|---------|----------|
| `invalid_client` | Invalid Client ID/Secret | Check credentials |
| `invalid_grant` | Invalid/expired authorization code | Request new code |
| `invalid_request` | Missing required parameter | Check request body |
| `unauthorized_client` | Client not authorized | Check app settings |

### API Errors

**Error Response Format:**
```json
{
  "status": 401,
  "success": false,
  "error": {
    "message": "Unauthenticated.",
    "code": "unauthorized"
  }
}
```

**Common API Errors:**

| Status | Error | Solution |
|--------|-------|----------|
| 401 | Unauthorized | Refresh access token |
| 403 | Forbidden | Check permissions/scopes |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Implement rate limiting |
| 500 | Server Error | Retry with exponential backoff |

### Retry Strategy

```typescript
async function fetchWithRetry(url: string, token: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.status === 401) {
        token = await refreshAccessToken();
        continue; // Retry with new token
      }
      
      if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after') || '60';
        await new Promise(resolve => setTimeout(resolve, parseInt(retryAfter) * 1000));
        continue;
      }
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
}
```

---

## Code Examples

### Complete OAuth Flow (Next.js App Router)

#### 1. Server Action: Initiate OAuth

```typescript
// app/actions/salla-oauth.ts
"use server";

import { redirect } from "next/navigation";
import crypto from "crypto";

const CLIENT_ID = process.env.SALLA_CLIENT_ID!;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/salla/callback`;

export async function initiateSallaOAuth(userId: string) {
  const state = crypto.randomBytes(32).toString('hex');
  
  // Save state to session/database
  await saveOAuthState(userId, state);
  
  const authUrl = new URL('https://accounts.salla.sa/oauth2/auth');
  authUrl.searchParams.set('client_id', CLIENT_ID);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.set('scope', 'offline_access');
  authUrl.searchParams.set('state', state);
  
  redirect(authUrl.toString());
}
```

#### 2. API Route: OAuth Callback

```typescript
// app/api/oauth/salla/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { integration } from "@/lib/db/schema";

const CLIENT_ID = process.env.SALLA_CLIENT_ID!;
const CLIENT_SECRET = process.env.SALLA_CLIENT_SECRET!;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/salla/callback`;

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    if (!code || !state) {
      return NextResponse.redirect('/dashboard/integrations/salla?error=missing_code');
    }
    
    // Verify state (CSRF protection)
    const userId = await getUserFromSession();
    const storedState = await getOAuthState(userId);
    if (state !== storedState) {
      return NextResponse.redirect('/dashboard/integrations/salla?error=invalid_state');
    }
    
    // Exchange code for token
    const tokenResponse = await fetch('https://accounts.salla.sa/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      })
    });
    
    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      console.error('Token exchange failed:', error);
      return NextResponse.redirect('/dashboard/integrations/salla?error=token_exchange_failed');
    }
    
    const tokens = await tokenResponse.json();
    
    // Fetch store info
    const storeResponse = await fetch('https://accounts.salla.sa/oauth2/user/info', {
      headers: { 'Authorization': `Bearer ${tokens.access_token}` }
    });
    
    const storeInfo = await storeResponse.json();
    
    // Save to database
    const credentials = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
      storeInfo
    };
    
    await db.insert(integration).values({
      userId,
      serviceId: 'salla',
      serviceName: Salla',
      status: 'connected',
      credentials: JSON.stringify(credentials),
      connectedAt: new Date()
    }).onConflictDoUpdate({
      target: [integration.userId, integration.serviceId],
      set: {
        credentials: JSON.stringify(credentials),
        status: 'connected',
        connectedAt: new Date()
      }
    });
    
    // Redirect to success page
    return NextResponse.redirect('/dashboard/integrations/salla?success=true');
    
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect('/dashboard/integrations/salla?error=server_error');
  }
}
```

#### 3. Webhook Handler

```typescript
// app/api/webhook/salla/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const CLIENT_SECRET = process.env.SALLA_CLIENT_SECRET!;

function verifySignature(body: string, signature: string): boolean {
  const hmac = crypto.createHmac('sha256', CLIENT_SECRET).update(body).digest('hex');
  return hmac === signature;
}

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-salla-signature');
    const body = await req.text();
    
    if (!signature || !verifySignature(body, signature)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    const payload = JSON.parse(body);
    const { event, merchant, data } = payload;
    
    console.log(`[Salla Webhook] Event: ${event}, Merchant: ${merchant}`);
    
    switch (event) {
      case 'app.store.authorize':
        await handleStoreAuthorize(merchant, data);
        break;
      
      case 'order.created':
        await handleOrderCreated(merchant, data);
        break;
      
      case 'app.uninstalled':
        await handleUninstall(merchant);
        break;
    }
    
    return new NextResponse('OK', { status: 200 });
    
  } catch (error) {
    console.error('[Salla Webhook] Error:', error);
    return new NextResponse('Server Error', { status: 500 });
  }
}

async function handleStoreAuthorize(merchantId: number, data: any) {
  // Save tokens from Easy Mode
  await db.insert(integration).values({
    userId: await getUserByMerchantId(merchantId),
    serviceId: 'salla',
    serviceName: 'Salla',
    status: 'connected',
    credentials: JSON.stringify({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000)
    }),
    metadata: JSON.stringify({ merchantId }),
    connectedAt: new Date()
  });
}
```

---

## Testing & Demo Stores

### 1. Create Demo Store

Visit: https://salla.dev/blog/how-to-test-your-app-using-salla-demo-stores/

### 2. Test Webhook Locally

Use **ngrok** to expose local webhook endpoint:

```bash
ngrok http 3000
```

Update webhook URL in Partner Portal to ngrok URL:
```
https://abc123.ngrok.io/api/webhook/salla
```

### 3. Trigger Test Events

Use **webhook.site** or Salla's webhook testing tools to simulate events.

---

## Additional Resources

- **Salla Documentation**: https://docs.salla.dev
- **OAuth 2.0 Spec**: https://datatracker.ietf.org/doc/html/rfc6749
- **Partner Portal**: https://salla.partners
- **Developer Blog**: https://salla.dev/blog
- **API Reference**: https://docs.salla.dev/doc-421117
- **LLMs.txt**: https://docs.salla.dev/llms.txt

---

## Summary Checklist

✅ Understand Easy Mode vs Custom Mode  
✅ Securely store Client ID and Client Secret  
✅ Implement proper OAuth 2.0 authorization code flow  
✅ Handle token exchange and refresh  
✅ Verify webhook signatures  
✅ Implement proactive token refresh strategy  
✅ Use proper error handling and retry logic  
✅ Test with Salla demo stores  
✅ Never expose tokens in logs or version control  
✅ Use HTTPS for all OAuth and webhook endpoints  

This knowledge base should enable any LLM to understand and implement Salla OAuth 2.0 integrations comprehensively.
