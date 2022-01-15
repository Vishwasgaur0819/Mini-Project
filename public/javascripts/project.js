$(document).ready(()=>{

    function fillcategory(category){
        $("#ptype").empty();
        $("#ptype").append($("<option>").text("-products-"))
        $.getJSON('/home/getproducttype',{'category':category},(data)=>{
            data.map((items)=>{
            $('#ptype').append($('<option>').text(items.typename).val(items.typeid))

            })
        })
    }
    
    $("#Food").change(()=>{
        fillcategory("Food")
        $("#gst").val('5');
    })

    $("#Electronics").change(()=>{
        fillcategory("Electronics")
        $("#gst").val('10');
    })

    $("#ptype").change(()=>{
        $("#unit").empty();
        $("#unit").append($("<option>").text('-Units-'))
        $.getJSON('/home/getunit',{'typeid':$("#ptype").val()},(data)=>{
           data.map((items)=>{
               $("#unit").append($("<option>").text(items.unitvalue).val(items.unitid))
           })
       })
    })

    $("#inr").change(()=>{
        $.getJSON('/home/getprice',{'unitid':$("#unit").val()},(data)=>{
            // alert(data[0].price);
            $("#price").val(data[0].price);
        })
    })

    $("#usd").change(()=>{
        $.getJSON('/home/getprice',{'unitid':$("#unit").val()},(data)=>{
            // alert(data[0].price);
            $("#price").val((data[0].price/74.8).toFixed(2));
        })
    })

    $("#offer").change(()=>{
        $("#discount").val($("#offer").val())
    })

})