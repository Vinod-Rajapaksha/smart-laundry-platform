import { SupplierModel, ISupplier } from '../../database/models/Supplier.js';

export class SupplierService {
    static async getSuppliers(): Promise<ISupplier[]> {
        return SupplierModel.find();
    }

    static async getSupplierById(id: string): Promise<ISupplier | null> {
        return SupplierModel.findById(id);
    }

    static async createSupplier(data: Partial<ISupplier>): Promise<ISupplier> {
        return SupplierModel.create(data);
    }

    static async updateSupplier(id: string, data: Partial<ISupplier>): Promise<ISupplier | null> {
        return SupplierModel.findByIdAndUpdate(id, data, { new: true });
    }

    static async deleteSupplier(id: string): Promise<void> {
        const result = await SupplierModel.findByIdAndDelete(id);
        if (!result) throw new Error("Supplier not found");
    }
}
