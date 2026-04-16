import { Router } from 'express';
import { auth } from '../../../middleware/auth.js';
import {
  getSavedCards,
  createSavedCard,
  deleteSavedCard,
  setDefaultCard
} from '../controller/savedCard.controller.js';

const router = Router();

router.get('/', auth, getSavedCards);

router.post('/', auth, createSavedCard);

router.delete('/:id', auth, deleteSavedCard);

router.patch('/:id/default', auth, setDefaultCard);

export default router;
