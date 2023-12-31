const express = require('express');
const router = express.Router()
// const customer= require('../routes/model/userSchema')
const customer= require('../model/user/userSchema')

const allProducts =require('../model/admin/productSchema');
const { consumers } = require('nodemailer/lib/xoauth2');
const multer  = require('multer') 
const upload = require('../middleware/multer')
const adminAuth = require('../middleware/admin_session')



const loginControls = require('../controller/admin controller/admin_login')
const adminPaymentControll = require('../controller/admin controller/adminPaymentControll')
const dashbord_controll = require('../controller/admin controller/dashboard_controll')
const product_controll = require('../controller/admin controller/product_controll')
const customer_controll = require('../controller/admin controller/admin_customers_controll')
const category_controll = require('../controller/admin controller/admin_category_controll')
const adminOrderControll = require('../controller/admin controller/adminOrderController')
const couponController=require('../controller/admin controller/admin_coupen_controller')
const bannerControll = require('../controller/admin controller/admin_bannerControll')


// admin login
router.get('/admin',adminAuth.adminExist,loginControls.admin_login)
//admin login post
router.post('/admin/products',adminAuth.adminExist,loginControls.admin_login_post)
//admin logout
router.get('/admin/logout',loginControls.admin_logout )
//---------------------------------------------------------------------------------------
//admin dashbord get 
router.get('/admin/dashbord',adminAuth.verifyAdmin,dashbord_controll.get_dashbord)
router.get('/admin/orderData',adminAuth.verifyAdmin,dashbord_controll.get_order_data)
router.post('/admin/download-sales-report',adminAuth.verifyAdmin, dashbord_controll.genereatesalesReport)
//--------------------------------------------------------------------------------------
//admin get products
router.get('/admin/products',adminAuth.verifyAdmin,product_controll.get_product) 

//admin product search 
router.post('/admin/products/search',adminAuth.verifyAdmin,product_controll.post_product_search)

//admin product refresh
router.get('/admin/products/refresh',adminAuth.verifyAdmin,product_controll.get_productRefresh)
//admin add new products
router.get('/admin/add-new-products',adminAuth.verifyAdmin,product_controll.get_add_new_products)
//admin add product post 
router.post('/admin/add-new-products',adminAuth.verifyAdmin,upload.array('images',12),product_controll.post_add_new_products)
//admin edit product get 
router.get('/admin/editProduct/:id',adminAuth.verifyAdmin,product_controll.get_edit_product)
//admin edit product(update)
router.get('/admin/deleteImageFromEditProduct',adminAuth.verifyAdmin,product_controll.deleteImageFromEditProduct)
router.post('/admin/update/:id',adminAuth.verifyAdmin,upload.array('images',12),product_controll.post_edit_product)
//admin delete product
router.get('/admin/deleteProduct/:id',adminAuth.verifyAdmin,product_controll.get_delete_product)
//-----------------------------------------------------------------------------------------------------
//admin get customers page
router.get('/admin/customers',adminAuth.verifyAdmin,customer_controll.get_customers)
//admin post customers search 
router.post('/admin/customers/search',adminAuth.verifyAdmin,customer_controll.post_search_customers)
//admin customers refresh
router.get('/admin/customers/refresh',adminAuth.verifyAdmin,customer_controll.get_customers_refresh)

//admin block customers
router.get('/admin/blockCustomers/:id',adminAuth.verifyAdmin,customer_controll.get_bolck_user)
//----------------------------------------------------------------------------------------------------------
//admin get categories
router.get('/admin/categories',adminAuth.verifyAdmin,category_controll.get_categories)

//admin get add_new category
router.get('/admin/add-new-catogeries',adminAuth.verifyAdmin,category_controll.add_new_category)

//admin post add_new category 
router.post('/admin/add-new-catogeries',adminAuth.verifyAdmin,category_controll.post_add_new_categories)
//admin post search 
router.post('/admin/categories/search',adminAuth.verifyAdmin,category_controll.post_search_catogery)

//admin get block category 
router.get('/admin/blockCategory/:id',adminAuth.verifyAdmin,category_controll.get_block_category)
//admin categories refresh
router.get('/admin/categories/refresh',adminAuth.verifyAdmin,category_controll.get_category_Refresh)

//--------------------------------------------------------------------------
//admin payment page get
router.get('/admin/paymensts',adminAuth.verifyAdmin,adminPaymentControll.get_payment)

//--------------------------------------------------------------------------
//admin order view page
router.get('/admin/orders',adminAuth.verifyAdmin,adminOrderControll.get_orderView)
router.get('/admin/get_OrderDetails/:id',adminAuth.verifyAdmin,adminOrderControll.get_OrderDetails)
router.put('/updateOrderStatus/:productId',adminAuth.verifyAdmin,adminOrderControll.updateOrderStatus)
router.get('/fetchconfirmOrderReturnData',adminAuth.verifyAdmin,adminOrderControll.fetchconfirmOrderReturnData)
router.post('/confirmOrderReturn',adminAuth.verifyAdmin,adminOrderControll.confirmOrderReturn)

//admin coupen management page
router.get('/admin/coupens',adminAuth.verifyAdmin, couponController.CouponManagement)
router.post('/admin/addNewCoupon',adminAuth.verifyAdmin, couponController.addCoupon)
router.delete('/admin/deleteCoupon/:couponId',adminAuth.verifyAdmin, couponController.deleteCoupon)
router.get('/admin/editCoupon/:couponId',adminAuth.verifyAdmin, couponController.editcouponget)
router.post('/admin/edit-coupon/:couponId',adminAuth.verifyAdmin, couponController.editCoupon)
//admin banner page
router.get('/admin/banners',adminAuth.verifyAdmin, bannerControll.get_banner)
router.post('/admin/addBannerSubmit',adminAuth.verifyAdmin,upload.array('banners',3),bannerControll.addBannerSubmit)



module.exports = router;    