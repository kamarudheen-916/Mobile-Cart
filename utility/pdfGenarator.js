const ejs = require('ejs');

const fs = require('fs');
const exceljs = require('exceljs');
const dateFormat = require('date-fns/format');
const salesPdf = require('./salesPdfgenerator')


module.exports = {
    downloadReport: async (req, res, orders, startDate, endDate, totalSales, format) => {
      const formattedStartDate = dateFormat(new Date(startDate), 'yyyy-MM-dd');
      const formattedEndDate = dateFormat(new Date(endDate), 'yyyy-MM-dd');
      try {
        
        
        if (format === 'pdf') {
         
          const pdfGenarate=await  salesPdf(orders,startDate,endDate)
          console.log("pdf generated successfully");
          res.setHeader("Content-Type", "application/pdf");
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=sales Report.pdf"
          );
          console.log('pdf....');
          res.status(200).end(pdfGenarate);
        } else if (format === 'excel') {
          const workbook = new exceljs.Workbook();
          const worksheet = workbook.addWorksheet('Sales Report');
  
          worksheet.columns = [
            { header: 'Order ID', key: 'orderId', width: 25 },
            { header: 'Product Name', key: 'productName', width: 25 },
            { header: 'User ID', key: 'userId', width: 25},
            { header: 'Date', key: 'date', width: 25 },
            { header: 'Total Amount', key: 'totalamount', width: 25 },
            { header: 'Payment Method', key: 'paymentmethod', width: 25 },
          ];
  
          let totalSalesAmount = 0;
          
          orders.forEach(order => {
          // console.log(orders);
            order.Products.forEach(item => {
              // console.log(item);
              worksheet.addRow({
                orderId: order._id,
                productName: item.ProductId.name,
                userId: order.UserId,
                date: order.OrderDate ? new Date(order.OrderDate).toLocaleDateString() : '',
                totalamount: item.ProductId.price !== undefined ? item.ProductId.price.toFixed(2) : '',
                paymentmethod: order.PaymentMethod,
              });
              totalSalesAmount += item.ProductId.price !== undefined ? item.ProductId.price : 0;
        
            });
          });
  
          
          worksheet.addRow({ totalamount: 'Total Sales Amount', paymentmethod: totalSalesAmount.toFixed(2) });
  
          const excelFilePath = `public/salesReport/excel/sales-report-${formattedStartDate}-${formattedEndDate}.xlsx`;
          await workbook.xlsx.writeFile(excelFilePath);
  
          res.status(200).download(excelFilePath);
        } else {
          res.status(400).send('Invalid download format');
        }
      } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).send('Internal Server Error');
      }
    },
};