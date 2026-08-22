import { STORE_INFO } from './constants';
import { Product, InquiryCartItem, DailyRates } from './types';
import { calculateProductPrice, formatNPR, formatWeight } from './rates';

const WA_NUMBER = '9779857073727'; // International Nepal format for WhatsApp (9857073727)

export function getWhatsAppBaseUrl(message: string): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function generateSingleProductInquiry(product: Product, rates: DailyRates): string {
  const price = calculateProductPrice(product, rates);
  
  const text = 
`🙏 *Namaste RAMBADEVI Jewellers!*

I am interested in inquiring about this jewellery item from your website:

✨ *Product:* ${product.name}
🏷️ *SKU:* ${product.sku}
💎 *Category:* ${product.category}
👑 *Purity / Karat:* ${product.karat}
⚖️ *Weight:* ${formatWeight(product.weightGrams)}
💰 *Estimated Price:* ${formatNPR(price.totalPrice)} (Based on live market rate)

I would like to know more about this product's availability, exact making charges, and visit your Devdaha-5, Khaireni showroom.

Thank you!`;

  return getWhatsAppBaseUrl(text);
}

export function generateCartInquiry({
  items,
  customerName,
  customerPhone,
  customerAddress,
  notes,
  rates,
}: {
  items: InquiryCartItem[];
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  notes?: string;
  rates: DailyRates;
}): string {
  let totalEstPrice = 0;
  let totalWeightGrams = 0;

  const itemListText = items
    .map((item, index) => {
      const price = calculateProductPrice(item.product, rates);
      const itemTotal = price.totalPrice * item.quantity;
      totalEstPrice += itemTotal;
      totalWeightGrams += item.product.weightGrams * item.quantity;

      return `${index + 1}. *${item.product.name}* (Qty: ${item.quantity})
   • SKU: ${item.product.sku}
   • Karat: ${item.product.karat}
   • Weight: ${formatWeight(item.product.weightGrams * item.quantity)}
   • Est. Price: ${formatNPR(itemTotal)}${item.notes ? `\n   • Note: ${item.notes}` : ''}`;
    })
    .join('\n\n');

  const text = 
`🙏 *Namaste RAMBADEVI Jewellers!*
*Website Inquiry Cart - Purchase Query*

I would like to inquire about the following ${items.length} item(s) from your online catalog:

${itemListText}

━━━━━━━━━━━━━━━━━━━━
📊 *SUMMARY:*
• *Total Items:* ${items.reduce((acc, curr) => acc + curr.quantity, 0)}
• *Total Metal Weight:* ${formatWeight(totalWeightGrams)}
• *Estimated Total:* ${formatNPR(totalEstPrice)}
━━━━━━━━━━━━━━━━━━━━

👤 *Customer Details:*
• *Name:* ${customerName || 'Valued Customer'}
• *Phone / WhatsApp:* ${customerPhone || 'Shared via chat'}
${customerAddress ? `• *Location:* ${customerAddress}` : ''}
${notes ? `• *Special Inquiry / Request:* ${notes}` : ''}

Please confirm product availability, custom sizing options, and instructions for ordering or visiting your showroom in Devdaha-5, Khaireni, Rupandehi.`;

  return getWhatsAppBaseUrl(text);
}

export function generateCustomDesignInquiry({
  customerName,
  phone,
  metalType,
  category,
  weightRange,
  budgetNpr,
  notes,
}: {
  customerName: string;
  phone: string;
  metalType: string;
  category: string;
  weightRange: string;
  budgetNpr?: string;
  notes: string;
}): string {
  const text = 
`🙏 *Namaste RAMBADEVI Jewellers!*
*New Custom Design Inquiry* (Order Custom Design)

I want to order a custom-crafted jewellery piece with the following specifications:

👤 *Customer:* ${customerName}
📞 *Contact Phone:* ${phone}
💎 *Jewellery Type:* ${category}
👑 *Metal / Purity:* ${metalType}
⚖️ *Desired Weight Range:* ${weightRange}
${budgetNpr ? `💰 *Target Budget:* ${budgetNpr}\n` : ''}
📝 *Design Notes / Requirements:*
"${notes}"

Please review and let me know the estimated timeline and quotation. I am ready to visit Devdaha-5, Khaireni or discuss details here.`;

  return getWhatsAppBaseUrl(text);
}

export function generateRepairBookingInquiry({
  customerName,
  phone,
  itemType,
  serviceType,
  preferredDate,
  preferredTimeSlot,
  damageDescription,
}: {
  customerName: string;
  phone: string;
  itemType: string;
  serviceType: string;
  preferredDate: string;
  preferredTimeSlot: string;
  damageDescription: string;
}): string {
  const text = 
`🙏 *Namaste RAMBADEVI Jewellers!*
*Jewellery Repair & Polish Booking*

I would like to schedule a repair / polishing service at your Devdaha-5, Khaireni showroom:

👤 *Customer Name:* ${customerName}
📞 *Phone Number:* ${phone}
💍 *Item Type:* ${itemType}
🛠️ *Service Required:* ${serviceType}
📅 *Preferred Date:* ${preferredDate}
⏰ *Preferred Time Slot:* ${preferredTimeSlot}
📋 *Condition / Damage Description:*
"${damageDescription}"

Please confirm my appointment slot. Thank you!`;

  return getWhatsAppBaseUrl(text);
}

export function generateCalculatorQuoteInquiry({
  metalLabel,
  weightText,
  makingChargeText,
  estimatedTotalText,
}: {
  metalLabel: string;
  weightText: string;
  makingChargeText: string;
  estimatedTotalText: string;
}): string {
  const text = 
`🙏 *Namaste RAMBADEVI Jewellers!*
*Live Metal Price Calculator Inquiry*

I calculated a quotation on your website and would like to verify:

👑 *Metal Type:* ${metalLabel}
⚖️ *Weight:* ${weightText}
🔨 *Making Charges:* ${makingChargeText}
💰 *Calculated Price:* ${estimatedTotalText}

Could you please confirm if this rate is available today and whether you can craft this piece for me?`;

  return getWhatsAppBaseUrl(text);
}
