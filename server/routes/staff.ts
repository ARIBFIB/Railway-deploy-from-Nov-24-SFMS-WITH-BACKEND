import express from 'express';
import { createStaffMember, getAllStaffMembers } from '../controllers/staffController';

const router = express.Router();

router.post('/', createStaffMember);
router.get('/', getAllStaffMembers);

export default router;