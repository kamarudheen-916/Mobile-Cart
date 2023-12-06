
async function  chart(){
    let date=[],uniquedate=[],totals=[],dateSum = 0;
    selectedDate=  document.getElementById('date')
   
    fetch(`/admin/orderData`)
    .then((res)=>res.json())
    .then((Data)=>{
     
        if(Data.success){
           
            //call categoryChart function 
            const keysArray = Object.keys(Data.categorywise);
            const valuesArray = Object.values(Data.categorywise);
            categoryChart(keysArray,valuesArray)
            //--------------------------------------------------------------------------
           if(selectedDate.value ==='day')
           {
            
            Data.orderData.forEach(order => 
            {  
                let d =order.OrderDate.split(',')
                // date.push(Number((d[0].split('/'))[1]))  
                date.push(order.OrderDate.split(',')[0]) 
            });
           
            uniquedate = date.filter((element, index, arr) => date.indexOf(element) === index);
            

            for(let i=0;i<uniquedate.length;i++)
            {
                dateSum=0;
                Data.orderData.forEach(order=>
                {
                    if(order.OrderDate.split(',')[0] == uniquedate[i])
                    {
                            dateSum =  dateSum + order.TotalPrice
                    }
                })     
                    totals.push(dateSum)
            }
                
           }
           //------------------------------------------------------
           if(selectedDate.value === 'month')
           {
            
            Data.orderData.forEach(order => 
            {  
                let d =order.OrderDate.split(',')[0].split('/')
                d.splice(1,1)
                date.push( d.join('/'))  
            });
            uniquedate = date.filter((element, index, arr) => date.indexOf(element) === index);

            
            for(let i=0;i<uniquedate.length;i++)
            {
                dateSum=0;
                Data.orderData.forEach(order=>
                {   
                    let d =order.OrderDate.split(',')[0].split('/')
                       d.splice(1,1)
                    if(d.join('/')===uniquedate[i])
                    {
                            dateSum =  dateSum + order.TotalPrice
                    }
                })     
                    totals.push(dateSum)
            }
           }
           //--------------------------------------------------------------------------
           if(selectedDate.value === 'year')
           {
            Data.orderData.forEach(order => 
            {  
                let d =order.OrderDate.split(',')
                date.push(Number((d[0].split('/'))[2]))  
            });
            uniquedate = date.filter((element, index, arr) => date.indexOf(element) === index);

            
            for(let i=0;i<uniquedate.length;i++)
            {
                dateSum=0;
                Data.orderData.forEach(order=>
                {
                    if(Number(order.OrderDate.split(',')[0].split('/')[2])===uniquedate[i])
                    {
                            dateSum =  dateSum + order.TotalPrice
                    }
                })     
                    totals.push(dateSum)
            }
           }
         
           showallOrderSalesChart(uniquedate,totals)
        
        }
    })
    .catch((error)=>{
        console.error('Error in chart function:', error);
    })
    }
    //-----------------------------------------------------------------------
    function showallOrderSalesChart(uniquedate,totals){
        

        const xValues =  uniquedate;
            const eachToatal =  totals
       
            new Chart("acquisitions", {
            type: "bar",
            data: {
                labels: xValues,
                datasets: [{ 
                data:eachToatal,
                backgroundColor: "green",
                borderColor: "red",
                fill: true
                }]
            },
            options: {
                legend: {display: false},
                

            }
            });
    }
    

    //--------------------------------------------------------
   
    function categoryChart(keysArray,valuesArray){
        
        const xValues = [...keysArray];
        const yValues = [...valuesArray];
        const barColors = ["red", "green","blue","orange","brown"];
        
        new Chart("categoryChartId", {
          type: "doughnut",
          data: {
            labels: xValues,
            datasets: [{
              backgroundColor: barColors,
              data: yValues
            }]
          },
          options: {
            legend: {display: true},
            title: {
              display: true,
              text: "World Wine Production 2018"
            }
          }
        });
    }
    //===================================================================
    document.addEventListener('DOMContentLoaded',()=>{
        chart()      
    })