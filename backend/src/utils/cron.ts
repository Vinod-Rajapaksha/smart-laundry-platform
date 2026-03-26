import cron from 'node-cron';
import Inventory from '../database/models/Inventory.js';
import { sendLowStockEmail } from './email.js';

export const startCronJobs = () => {
  // Run every hour to check for low stock
  cron.schedule('0 * * * *', async () => {
    console.log('[CRON] Running automatic low stock check...');
    try {
      // Find all items where stock is <= reorder level, email hasn't been sent, and it has a supplier linked
      const lowStockItems = await Inventory.find({
        $expr: { $lte: ['$qtyInStock', '$reorderLevel'] },
        lowStockEmailSent: false,
        isActive: true,
        supplierId: { $ne: null }
      }).populate('supplierId');

      if (lowStockItems.length === 0) {
        console.log('[CRON] No new low stock items found.');
        return;
      }

      for (const item of lowStockItems) {
        const supplier: any = item.supplierId;
        if (!supplier || !supplier.email) continue;
        
        console.log(`[CRON] Detected low stock for ${item.name}. Emailing supplier ${supplier.name}...`);
        
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
          await item.save();
        } catch (err) {
          console.error(`[CRON] Failed to send restock email for ${item.name}`, err);
        }
      }
    } catch (err) {
      console.error('[CRON] Error during low stock check:', err);
    }
  });

  console.log('[CRON] Scheduled automatic low stock checks (Hourly)');
};
