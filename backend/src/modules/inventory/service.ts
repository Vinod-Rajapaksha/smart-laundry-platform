import Inventory from '../../database/models/Inventory';
import { sendLowStockEmail } from '../../utils/email';

export const deductStock = async (itemId: string, amount: number) => {
  const item = await Inventory.findById(itemId).populate('supplierId');
  if (!item) throw new Error('Item not found');

  item.qtyInStock -= amount;
  if (item.qtyInStock < 0) item.qtyInStock = 0;

  // Check low stock condition
  if (item.qtyInStock <= item.reorderLevel && !item.lowStockEmailSent && item.supplierId) {
    const supplier: any = item.supplierId;
    
    // Trigger email send
    try {
      await sendLowStockEmail(
        supplier.email,
        supplier.name,
        item.name,
        item.qtyInStock,
        item.reorderLevel,
        supplier._id.toString(),
        item._id.toString()
      );
      item.lowStockEmailSent = true;
    } catch (err) {
      console.error('Failed to send restock email to supplier', err);
    }
  }

  await item.save();
  return item;
};
