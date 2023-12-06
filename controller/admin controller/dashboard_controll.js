const customer = require('../../model/user/userSchema')
const Order  = require('../../model/user/userOrder')
const allProducts=require('../../model/admin/productSchema')
const admin = require('../../model/admin/admin_Schema')
const categoryCollection = require('../../model/admin/admin_categorySchema')
const pdf=require('../../utility/pdfGenarator')
const bcrypt = require('bcrypt')
// const { default: products } = require('razorpay/dist/types/products')
// const { default: orders } = require('razorpay/dist/types/orders')


const get_dashbord=async(req,res)=>{    
    try {
        const admin = req.session.adminLoggedin
    if(admin){

      const bestSeller = await Order.aggregate([
        {
          $unwind: "$Products",
        },
        {
          $group: {
            _id: "$Products.ProductId",
            totalCount: { $sum: "$Products.Quantity" },
          },
        },
        {
          $sort: {
            totalCount: -1,
          },
        },
        {
          $limit: 5,
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $unwind: "$productDetails",
        },
      ]);

      // const categorywise =  await Order.find({PaymentStatus:{$ne:'Pending'}}).populate('Products.ProductId')
      // console.log('===================/////////////',categorywise[0].Products[0].ProductId);
      
      if (!bestSeller) throw new Error("No Data Found");

     
        res.render('admin/adminDashbord',{title:'Admin Dashbord',bestSeller})
    }else{
        res.redirect('/admin') 
    }
   
    } catch (error) {
        console.log('dashboard get method error :---',error);
    }
}

const get_order_data = async (req, res) => { 
        try {
            const orderData = await Order.find({'return.returnStatus':{$ne:'Returned'}}).populate('Products.ProductId')
            
            let categorywise = {}
            orderData.forEach((order)=>{
              order.Products.forEach((product)=>{
                let keyToCheck = product.ProductId.category;
                console.log(product );
                categorywise[keyToCheck] = categorywise.hasOwnProperty(keyToCheck) ? categorywise[keyToCheck] + product.ProductId.price :  product.ProductId.price;
              }) 
            })
          
            
            res.json({success:true,orderData,categorywise})
        } catch (error) {
            console.log('admin dashboard get order data error : ',error);
        }
  };
  
  const genereatesalesReport = async (req, res) => {
    try {
      // console.log(req.body);
      const startDate =new Date( req.body.startDate).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
      const format = req.body.downloadFormat;
      const endDate = new Date(req.body.endDate).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    //   endDate.setHours(23, 59, 59, 999);
        // console.log(endDate,startDate);
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