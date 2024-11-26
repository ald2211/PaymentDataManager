import Entry from "../models/details.model.js";
import ExcelJS from 'exceljs';



export const createNewEntry=async (req, res) => {
    try {
      const entry = new Entry(req.body);
      await entry.save();
      res.status(201).json({success:true,data:entry,message:'new Entry successfull'});
    } catch (error) {
        console.log('error at create new entry:',error)
      res.status(400).json({ message: 'new entry creation failed' });
    }
  }


  export const getAllEntries=async (req, res) => {
    try {
      const entries = await Entry.find().sort({ createdAt: -1 });
      res.json({success:true,data:entries});
    } catch (error) {
        console.log('error fetching entries:',error)
      res.status(500).json({ message: 'fetching entries failed' });
    }
  }

  export const getExcel = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      // Fetch entries within the date range
      const entries = await Entry.find({
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      });
      
      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Entries');
  
      // Define worksheet columns
      worksheet.columns = [
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Card', key: 'card', width: 15 },
        { header: 'Consignee', key: 'consignee', width: 20 },
        { header: 'Remark', key: 'remark', width: 30 },
        { header: 'Amount', key: 'amount', width: 10 },
      ];
  
      // Add rows to worksheet
      entries.forEach((entry) => {
        worksheet.addRow({
          date: entry.date.toLocaleDateString(),
          card: entry.card,
          consignee: entry.consignee,
          remark: entry.remark,
          amount: entry.amount,
        });
      });
  
      // Set headers for download
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader('Content-Disposition', 'attachment; filename="entries.xlsx"');
  
      // Write workbook to response
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.log('err:',error)
      res.status(500).json({ message: error.message });
    }
  };


  export const updateEntry=async (req, res) => {
    try {
      const entry = await Entry.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  export const deleteEntry=async (req, res) => {
    try {
      await Entry.findByIdAndDelete(req.params.id);
      res.json({ message: 'Entry deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }