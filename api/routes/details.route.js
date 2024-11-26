import express from 'express';

import verifyUser from '../utils/verify.js';
import ExcelJS from 'exceljs';
import Details from '../models/details.model.js';
import { createNewEntry, deleteEntry, getAllEntries, getExcel, updateEntry } from '../controllers/details.controller.js';
const router= express.Router()


// Create new entry
router.post('/',verifyUser,createNewEntry);

// Get all entries
router.get('/',verifyUser, getAllEntries);

// Get entries by date range
router.get('/export',verifyUser,getExcel );

// Update entry
router.put('/:id',verifyUser,updateEntry );

// Delete entry
router.delete('/:id', verifyUser,deleteEntry);



export default router