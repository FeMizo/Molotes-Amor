import type { Order, OrderStatus } from "@/types/order";
import { formatCurrency } from "@/lib/format";

const normalizePhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("52") && digits.length === 12) return `whatsapp:+${digits}`;
  if (digits.length === 10) return `whatsapp:+52${digits}`;
  return `whatsapp:+${digits}`;
};

const sendTwilioMessage = async (to: string, body: string): Promise<void> => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;

  if (!accountSid || !authToken || !from) return;

  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ From: from, To: to, Body: body }).toString(),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Twilio error ${response.status}: ${error}`);
  }
};

// Mensajes al cliente cuando cambia el estado
const statusMessages: Partial<Record<OrderStatus, (order: Order) => string>> = {
  confirmado: (order) =>
    `✅ *Molotes El Tradicional*\n\nHola ${order.customer.name}, tu pedido *#${order.paymentRef}* quedó confirmado.\n\nTe avisamos cuando esté en camino. 🌮`,

  preparando: (order) =>
    `🔥 *Molotes El Tradicional*\n\nHola ${order.customer.name}, ya estamos preparando tu pedido *#${order.paymentRef}*.\n\n_Total: ${formatCurrency(order.total)}_`,

  "en-camino": (order) =>
    `🛵 *Molotes El Tradicional*\n\nHola ${order.customer.name}, tu pedido *#${order.paymentRef}* ya va en camino${order.customer.address ? ` a *${order.customer.address}*` : ""}.\n\n¡Ya casi llega! 🌮`,

  entregado: (order) =>
    `🎉 *Molotes El Tradicional*\n\nHola ${order.customer.name}, tu pedido *#${order.paymentRef}* fue entregado.\n\n¡Gracias por tu preferencia! Que lo disfrutes. 🌮`,

  cancelado: (order) =>
    `❌ *Molotes El Tradicional*\n\nHola ${order.customer.name}, tu pedido *#${order.paymentRef}* fue cancelado.\n\nSi tienes dudas escríbenos directamente.`,
};

export const notifyOrderStatusChange = async (order: Order, status: OrderStatus): Promise<void> => {
  const buildMessage = statusMessages[status];
  if (!buildMessage) return;

  const phone = order.customer.phone?.trim();
  if (!phone) return;

  await sendTwilioMessage(normalizePhone(phone), buildMessage(order));
};

// Notificación al admin cuando llega un pedido nuevo
export const notifyAdminNewOrder = async (order: Order): Promise<void> => {
  const adminPhone = process.env.TWILIO_ADMIN_PHONE;
  if (!adminPhone) return;

  const itemsList = order.items
    .map((item) => `• ${item.quantity}x ${item.productName}`)
    .join("\n");

  const deliveryDay = order.deliveryDay === "sabado" ? "Sábado" : order.deliveryDay === "domingo" ? "Domingo" : "";

  const message = [
    `🛒 *Pedido nuevo #${order.paymentRef}*`,
    ``,
    `👤 ${order.customer.name}`,
    `📞 ${order.customer.phone}`,
    order.customer.address ? `📍 ${order.customer.address}` : null,
    deliveryDay ? `📅 Entrega: ${deliveryDay}` : null,
    `💳 Pago: ${order.payment?.method === "transferencia" ? "Transferencia" : "Efectivo"}`,
    ``,
    itemsList,
    ``,
    `💰 *Total: ${formatCurrency(order.total)}*`,
    order.notes ? `\n📝 Nota: ${order.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  await sendTwilioMessage(normalizePhone(adminPhone), message);
};
