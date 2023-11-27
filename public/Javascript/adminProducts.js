function AddNewProductSubmit(){
    const productname = document.getElementById('productname').value
    const name_error = document.getElementById('name_error')
    const AddNewPrice = document.getElementById('AddNewPrice').value
    const price_error =  document.getElementById('price_error')
    const AddNewStock  =  document.getElementById('AddNewStock').value
    const stock_error = document.getElementById('stock_error')
   if(productname.trim()===''){
      name_error.innerText = 'This Feild is required..!'
    return false
   }
   if(AddNewPrice<1){
    price_error.innerText ='Must be more than zero..!'
    return false
   }
   if(AddNewStock<1){
    stock_error.innerText = 'Must be more than zero..!'
    return false
   }
   return true
  }
  function AddNewProductClear(input){
    const productname = document.getElementById('productname').value
    const name_error = document.getElementById('name_error')
    const price_error =  document.getElementById('price_error')
    const stock_error = document.getElementById('stock_error')
    if(input === 'productname'){
    name_error.innerText = ''
    }
    if(input ==='AddNewPrice'){
      price_error.innerText=''
    }
    if(input ==='AddNewStock'){
      stock_error.innerText =  ''
    }

  }