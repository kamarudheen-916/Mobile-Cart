const customer = require('../../model/user/userSchema')
const Order  = require('../../model/user/userOrder')
const allProducts=require('../../model/admin/productSchema')
const admin = require('../../model/admin/admin_Schema')
const categoryCollection = require('../../model/admin/admin_categorySchema')
const pdf=require('../../utility/pdfGenarator')
const bcrypt = require('bcrypt')


const get_dashbord=async(req,res)=>{    
    try {
        const admin = req.session.adminLoggedin
    if(admin){
       
        res.render('admin/adminDashbord',{title:'Admin Dashbord'})
    }else{
        res.redirect('/admin') 
    }
   
    } catch (error) {
        console.log('dashboard get method error :---',error);
    }
}

const get_order_data = async (req, res) => {
        try {
            const orderData = await Order.find({'return.returnStatus':{$ne:'Returned'}})
            console.log('===============',orderData);
            res.json({success:true,orderData})
        } catch (error) {
            console.log('admin dashboard get order data error : ',error);
        }
  };
  
  const genereatesalesReport = async (req, res) => {
    try {
      console.log(req.body);
      const startDate = req.body.startDate;
      const format = req.body.downloadFormat;
      const endDate = new Date(req.body.endDate);
    //   endDate.setHours(23, 59, 59, 999);
        console.log(endDate,startDate);
      const orders = await Order.find({
        PaymentStatus: { $in: ["Online Payment", "Pending",'Pament successfull(Wallet)'] },
        OrderDate: {
          $gte: startDate,
          $lte: endDate,
        },
      }).populate("Products.ProductId");
      
  
      let totalSales = 0;
  
      orders.forEach((order) => {
        totalSales += order.TotalPrice || 0;
      });
      
  
      pdf.downloadReport(
        req,
        res,
        orders,
        startDate,
        endDate,
        totalSales.toFixed(2),
        format
      );
    } catch (error) {
      console.log("Error while generating sales report pdf:", error);
      res.status(500).send("Internal Server Error");
    }
  };
    
    

module.exports = {
    get_dashbord,
    get_order_data,
    genereatesalesReport,
    
}