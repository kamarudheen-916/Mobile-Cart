
async function  chart(){
    let date=[],uniquedate=[],totals=[],dateSum = 0;
    selectedDate=  document.getElementById('date')
   
    fetch(`/admin/orderData`)
    .then((res)=>res.json())
    .then((Data)=>{
        if(Data.success){
           
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
            console.log(uniquedate);

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
         
           showChart(uniquedate,totals)
        
        }
    })
    .catch((error)=>{
        console.log(error);
    })
    }
    //-----------------------------------------------------------------------
    function showChart(uniquedate,totals){
        //    alert(selectedDate.value)

        const xValues =  uniquedate;
            const eachToatal =  totals
            console.log(xValues)
            console.log(eachToatal)
            console.log('xValues,eachToatal');
            console.log(uniquedate);
            console.log(eachToatal);
            new Chart("acquisitions", {
            type: "bar",
            data: {
                labels: xValues,
                datasets: [{ 
                data:eachToatal,
                borderColor: "red",
                fill: true
                }]
            },
            options: {
                legend: {display: false}
            }
            });
    }
    //-----------------------------------------------------------------------
    // (async function() {
    //     chart()
        
    // })();
    document.addEventListener('DOMContentLoaded',()=>{
        chart()
    })