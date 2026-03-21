import { Router } from 'express';
import Staff from '../../database/models/Staff.js';

const router = Router();

// POST /api/staff - Add new staff
router.post('/', async (req, res) => {
    try {
        const { fullName, email, phone, role, salary, status } = req.body;

        // Check if staff already exists
        const existingStaff = await Staff.findOne({ email });
        if (existingStaff) {
            return res.status(400).json({ message: 'Staff with this email already exists' });
        }

        const newStaff = new Staff({
            fullName,
            email,
            phone,
            role,
            salary,
            status
        });

        await newStaff.save();
        res.status(201).json({ message: 'Staff member added successfully', staff: newStaff });
    } catch (error: any) {
        console.error('Error adding staff:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// GET /api/staff - Get all staff members
router.get('/', async (req, res) => {
    try {
        const staffMembers = await Staff.find().sort({ createdAt: -1 });
        res.status(200).json(staffMembers);
    } catch (error: any) {
        console.error('Error fetching staff:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

export default router;
