import { Request, Response } from 'express';
import { createSupplierSchema, updateSupplierSchema } from './validation.js';
import { 
  createSupplierSession, 
  fetchAllSuppliers, 
  fetchSupplierById, 
  editSupplier, 
  removeSupplier 
} from './service.js';
import Inventory from '../../database/models/Inventory.js';
import { sendLowStockEmail } from '../../utils/email.js';

export const createSupplier = async (req: Request, res: Response) => {
  try {
    const { error, value } = createSupplierSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    
    const supplier = await createSupplierSession(value);
    return res.status(201).json({ success: true, data: supplier });
  } catch (err: any) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'Supplier with this email already exists' });
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllSuppliers = async (req: Request, res: Response) => {
  try {
    const suppliers = await fetchAllSuppliers();
    return res.status(200).json({ success: true, data: suppliers });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getSupplierById = async (req: Request, res: Response) => {
  try {
    const supplier = await fetchSupplierById(req.params.id);
    if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found' });
    return res.status(200).json({ success: true, data: supplier });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateSupplier = async (req: Request, res: Response) => {
  try {
    const { error, value } = updateSupplierSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    
    const supplier = await editSupplier(req.params.id, value);
    if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found' });
    return res.status(200).json({ success: true, data: supplier });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteSupplier = async (req: Request, res: Response) => {
  try {
    const supplier = await removeSupplier(req.params.id);
    if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found' });
    return res.status(200).json({ success: true, message: 'Supplier deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const confirmRestock = async (req: Request, res: Response) => {
  try {
    const { supplierId, itemId } = req.query;
    
    if (!supplierId || !itemId) {
      return res.status(400).send('<h1>Invalid Request. Missing Parameters.</h1>');
    }
    
    const inventoryItem = await Inventory.findByIdAndUpdate(itemId, { 
      $set: { lowStockEmailSent: false } 
    }, { new: true });
    
    if (!inventoryItem) {
      return res.status(404).send('<h1>Item not found.</h1>');
    }

    return res.status(200).send(`
      <html>
        <head>
          <style>
            body { font-family: sans-serif; text-align: center; padding: 50px; background-color: #f4f7f6; }
            .card { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: inline-block;}
            h1 { color: #2e7d32; }
            p { color: #555; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>✅ Restock Confirmed</h1>
            <p>Thank you for acknowledging the restock request for <strong>${inventoryItem.name}</strong>.</p>
            <p>We look forward to receiving the items soon.</p>
          </div>
        </body>
      </html>
    `);
  } catch (err: any) {
    return res.status(500).send('<h1>An error occurred processing your request.</h1>');
  }
};

export const notifyLowStock = async (req: Request, res: Response) => {
  try {
    const { supplierId, itemId, itemName, currentStock, reorderLevel } = req.body;
    const supplier = await fetchSupplierById(supplierId);
    
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    await sendLowStockEmail(
      supplier.email,
      supplier.name,
      itemName,
      currentStock,
      reorderLevel,
      supplierId,
      itemId
    );

    return res.status(200).json({ success: true, message: 'Notification sent' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
