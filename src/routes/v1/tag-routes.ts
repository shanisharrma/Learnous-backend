import express from 'express';
import { TagController } from '../../controllers';

const router = express.Router();

// ========================================================================================================= //
// ============================================ Tag Routes =================================================
// ========================================================================================================= //

// Get all the tags : GET /api/v1/tags
router.route('/tags').get(TagController.showAll);

// GET all the suggested tags: GET /api/v1/tags/suggestions
router.route('/tags/suggestions').get(TagController.getSuggestions);

export default router;
