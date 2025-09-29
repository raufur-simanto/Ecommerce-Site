import { createEmailTemplate } from './email'

export interface OrderEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  items: Array<{
    name: string
    sku: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
  subtotal: number
  taxAmount: number
  shippingAmount: number
  discountAmount: number
  totalAmount: number
  billingAddress?: {
    firstName: string
    lastName: string
    street1: string
    street2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  shippingAddress?: {
    firstName: string
    lastName: string
    street1: string
    street2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

export const createOrderConfirmationEmail = (orderData: OrderEmailData) => {
  const content = `
    <h2>Thank you for your order!</h2>
    <p>Hello ${orderData.customerName},</p>
    <p>We've received your order and are preparing it for shipment. Here are your order details:</p>
    
    <div class="order-details">
      <h3>Order #${orderData.orderNumber}</h3>
      
      <table class="order-items">
        <thead>
          <tr>
            <th>Item</th>
            <th>SKU</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${orderData.items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.sku}</td>
              <td>${item.quantity}</td>
              <td>$${item.unitPrice.toFixed(2)}</td>
              <td>$${item.totalPrice.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4"><strong>Subtotal:</strong></td>
            <td><strong>$${orderData.subtotal.toFixed(2)}</strong></td>
          </tr>
          ${orderData.taxAmount > 0 ? `
          <tr>
            <td colspan="4"><strong>Tax:</strong></td>
            <td><strong>$${orderData.taxAmount.toFixed(2)}</strong></td>
          </tr>
          ` : ''}
          ${orderData.shippingAmount > 0 ? `
          <tr>
            <td colspan="4"><strong>Shipping:</strong></td>
            <td><strong>$${orderData.shippingAmount.toFixed(2)}</strong></td>
          </tr>
          ` : ''}
          ${orderData.discountAmount > 0 ? `
          <tr>
            <td colspan="4"><strong>Discount:</strong></td>
            <td><strong>-$${orderData.discountAmount.toFixed(2)}</strong></td>
          </tr>
          ` : ''}
          <tr class="total-row">
            <td colspan="4"><strong>Total:</strong></td>
            <td><strong>$${orderData.totalAmount.toFixed(2)}</strong></td>
          </tr>
        </tfoot>
      </table>
    </div>

    ${orderData.shippingAddress ? `
    <div class="order-details">
      <h3>Shipping Address</h3>
      <p>
        ${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}<br>
        ${orderData.shippingAddress.street1}<br>
        ${orderData.shippingAddress.street2 ? orderData.shippingAddress.street2 + '<br>' : ''}
        ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.postalCode}<br>
        ${orderData.shippingAddress.country}
      </p>
    </div>
    ` : ''}

    <p>We'll send you another email with tracking information once your order ships.</p>
    <p>Thank you for shopping with us!</p>
  `

  return createEmailTemplate(content, `Order Confirmation - #${orderData.orderNumber}`)
}

export interface ShippingUpdateData {
  orderNumber: string
  customerName: string
  trackingNumber?: string
  carrier?: string
  estimatedDelivery?: Date
  shippingAddress: {
    firstName: string
    lastName: string
    street1: string
    street2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

export const createShippingNotificationEmail = (shippingData: ShippingUpdateData) => {
  const content = `
    <h2>Your order has shipped!</h2>
    <p>Hello ${shippingData.customerName},</p>
    <p>Great news! Your order #${shippingData.orderNumber} has been shipped and is on its way to you.</p>
    
    <div class="order-details">
      <h3>Shipping Details</h3>
      ${shippingData.trackingNumber ? `
        <p><strong>Tracking Number:</strong> ${shippingData.trackingNumber}</p>
      ` : ''}
      ${shippingData.carrier ? `
        <p><strong>Carrier:</strong> ${shippingData.carrier}</p>
      ` : ''}
      ${shippingData.estimatedDelivery ? `
        <p><strong>Estimated Delivery:</strong> ${shippingData.estimatedDelivery.toLocaleDateString()}</p>
      ` : ''}
      
      <h4>Shipping To:</h4>
      <p>
        ${shippingData.shippingAddress.firstName} ${shippingData.shippingAddress.lastName}<br>
        ${shippingData.shippingAddress.street1}<br>
        ${shippingData.shippingAddress.street2 ? shippingData.shippingAddress.street2 + '<br>' : ''}
        ${shippingData.shippingAddress.city}, ${shippingData.shippingAddress.state} ${shippingData.shippingAddress.postalCode}<br>
        ${shippingData.shippingAddress.country}
      </p>
    </div>

    ${shippingData.trackingNumber ? `
      <a href="#" class="button">Track Your Package</a>
    ` : ''}

    <p>Thank you for your business!</p>
  `

  return createEmailTemplate(content, `Order Shipped - #${shippingData.orderNumber}`)
}

export const createWelcomeEmail = (userName: string, userEmail: string) => {
  const content = `
    <h2>Welcome to E-Commerce Store!</h2>
    <p>Hello ${userName},</p>
    <p>Thank you for creating an account with us. We're excited to have you as part of our community!</p>
    
    <div class="order-details">
      <h3>What's Next?</h3>
      <ul>
        <li>Browse our extensive product catalog</li>
        <li>Add items to your wishlist for later</li>
        <li>Enjoy fast and secure checkout</li>
        <li>Track your orders in real-time</li>
        <li>Leave reviews and ratings for products</li>
      </ul>
    </div>

    <a href="/products" class="button">Start Shopping</a>

    <p>If you have any questions, feel free to contact our customer support team.</p>
    <p>Happy shopping!</p>
  `

  return createEmailTemplate(content, 'Welcome to E-Commerce Store!')
}

export const createPasswordResetEmail = (userName: string, resetToken: string, resetUrl: string) => {
  const content = `
    <h2>Password Reset Request</h2>
    <p>Hello ${userName},</p>
    <p>We received a request to reset your password for your E-Commerce Store account.</p>
    
    <div class="order-details">
      <p><strong>If you requested this password reset, click the button below:</strong></p>
      <a href="${resetUrl}" class="button">Reset Your Password</a>
      <p><small>This link will expire in 1 hour for security reasons.</small></p>
    </div>

    <p><strong>If you didn't request this password reset:</strong></p>
    <p>You can safely ignore this email. Your password will not be changed.</p>
    
    <p>For security reasons, we recommend:</p>
    <ul>
      <li>Using a strong, unique password</li>
      <li>Not sharing your password with anyone</li>
      <li>Logging out of shared computers</li>
    </ul>
  `

  return createEmailTemplate(content, 'Password Reset Request - E-Commerce Store')
}

export const createEmailVerificationEmail = (userName: string, verificationUrl: string) => {
  const content = `
    <h2>Please verify your email address</h2>
    <p>Hello ${userName},</p>
    <p>Thank you for creating an account with E-Commerce Store. To complete your registration, please verify your email address.</p>
    
    <div class="order-details">
      <p><strong>Click the button below to verify your email:</strong></p>
      <a href="${verificationUrl}" class="button">Verify Email Address</a>
      <p><small>This link will expire in 24 hours.</small></p>
    </div>

    <p>Once verified, you'll be able to:</p>
    <ul>
      <li>Place orders and track them</li>
      <li>Save items to your wishlist</li>
      <li>Receive order updates and notifications</li>
      <li>Access your order history</li>
    </ul>

    <p>If you didn't create this account, you can safely ignore this email.</p>
  `

  return createEmailTemplate(content, 'Verify Your Email - E-Commerce Store')
}

export const createReviewRequestEmail = (orderData: { orderNumber: string, customerName: string, items: Array<{ name: string, id: string }> }) => {
  const content = `
    <h2>How was your recent purchase?</h2>
    <p>Hello ${orderData.customerName},</p>
    <p>We hope you're enjoying your recent purchase from order #${orderData.orderNumber}!</p>
    
    <div class="order-details">
      <h3>Items from your order:</h3>
      <ul>
        ${orderData.items.map(item => `
          <li>${item.name}</li>
        `).join('')}
      </ul>
    </div>

    <p>Your feedback helps other customers make informed decisions and helps us improve our products and services.</p>
    
    <a href="/orders/${orderData.orderNumber}" class="button">Leave a Review</a>

    <p>Thank you for choosing E-Commerce Store!</p>
  `

  return createEmailTemplate(content, 'Review Your Recent Purchase')
}

export const createAdminNewOrderEmail = (orderData: OrderEmailData) => {
  const content = `
    <h2>New Order Received</h2>
    <p>A new order has been placed and requires processing.</p>
    
    <div class="order-details">
      <h3>Order #${orderData.orderNumber}</h3>
      <p><strong>Customer:</strong> ${orderData.customerName} (${orderData.customerEmail})</p>
      <p><strong>Total Amount:</strong> $${orderData.totalAmount.toFixed(2)}</p>
      <p><strong>Items:</strong> ${orderData.items.length}</p>
      
      <table class="order-items">
        <thead>
          <tr>
            <th>Item</th>
            <th>SKU</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${orderData.items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.sku}</td>
              <td>${item.quantity}</td>
              <td>$${item.totalPrice.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <a href="/admin/orders" class="button">View Order in Admin</a>

    <p>Please process this order as soon as possible.</p>
  `

  return createEmailTemplate(content, `New Order Alert - #${orderData.orderNumber}`)
}

export const createLowStockAlert = (products: Array<{ name: string, sku: string, currentStock: number, lowStockLevel: number }>) => {
  const content = `
    <h2>Low Stock Alert</h2>
    <p>The following products are running low on inventory:</p>
    
    <div class="order-details">
      <table class="order-items">
        <thead>
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th>Current Stock</th>
            <th>Low Stock Level</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(product => `
            <tr>
              <td>${product.name}</td>
              <td>${product.sku}</td>
              <td style="color: ${product.currentStock === 0 ? '#dc3545' : '#ffc107'}">
                ${product.currentStock}
              </td>
              <td>${product.lowStockLevel}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <a href="/admin/products" class="button">Manage Inventory</a>

    <p>Please restock these items to avoid stockouts.</p>
  `

  return createEmailTemplate(content, 'Low Stock Alert - Action Required')
}
