// const { response } = require('express');
const express = require('express');
const router = express.Router();
const pool = require('./pool');
var upload = require('./multer');
var LocalStorage = require('node-localstorage').LocalStorage;
var localstorage = new LocalStorage('./scratch');

router.get('/productinterface', (req, res) => {
    var result = JSON.parse(localstorage.getItem("ADMIN"));
    if(result==null){
        res.redirect('/admin/adminlogin')
    }else{
        console.log('xxxxxx',result);
        res.render('productinterface', { "message": "",result:result });
    }

   
})

router.get('/displayproducts', (req, res) => {
    var resulT = JSON.parse(localstorage.getItem("ADMIN"));
    if(resulT==null){
        
        res.redirect('/admin/adminlogin')
    }else{
        pool.query("select P.*,(select U.unitvalue from units U where U.unitid = P.unitid) as unitname,(select PT.typename from producttype PT where PT.typeid=P.producttypeid) as producttypename from products P", (error, result) => {
            if (error) {
                res.render("displayallproducts", { result: [], msg: 'Server Error',resulT:resulT })
            } else {
                if (result.length == 0) {
                    res.render("displayallproducts", { result: [], msg: 'No Record Found',resulT:resulT })
                } else {
                    res.render("displayallproducts", { result: result, msg: '',resulT:resulT })
                }
            }
        })
    }

   
})

router.post('/productsubmit', upload.single('picture'), (req, res) => {
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);


    pool.query("insert into products(productname,productmodel,category,gst,producttypeid,unitid,currencytype,price,offertype,offerrate,stock,picture)values(?,?,?,?,?,?,?,?,?,?,?,?)", [req.body.productname, req.body.productmodel, req.body.category, req.body.gst, req.body.producttype, req.body.unit, req.body.currency, req.body.price, req.body.offer, req.body.offerrate, req.body.stock, req.file.filename], (error, result) => {
        if (error) {
            console.log(error)
            res.render("productinterface", { message: "Server error",result:'' })
        }
        else {
            console.log(result);
            res.render("productinterface", { message: "Record Submited Successfully...",result:result })
        }
    })
})

router.get('/getproducttype', (req, res) => {
    pool.query('select * from producttype where category = ?', [req.query.category], (err, result) => {
        if (err) {
            res.status(500).json([])

        } else {
            res.status(200).json(result)
        }
    })
})

router.get('/getunit', (req, res) => {
    pool.query('select * from units where typeid =?', [req.query.typeid], (err, result) => {
        if (err) {
            res.status(500).json([])
        } else {
            res.status(200).json(result)
        }
    })
})

router.get('/getprice', (req, res) => {
    pool.query('select * from units where unitid =?', [req.query.unitid], (err, result) => {
        if (err) {
            res.status(500).json([])
        } else {
            res.status(200).json(result)
        }
    })
})


router.get('/displaybyid', (req, res) => {
    var resulT = JSON.parse(localstorage.getItem("ADMIN"));
    if(resulT==null){
        res.render('adminlogin',{msg:""})
    }else{
        pool.query("select P.*,(select U.unitvalue from units U where U.unitid = P.unitid) as unitname,(select PT.typename from producttype PT where PT.typeid=P.producttypeid) as producttypename from products P where P.productid=?", [req.query.pid], (error, result) => {
            if (error) {
                res.render("displaybyid", { result: [],resulT:resulT })
            } else {
    
                res.render("displaybyid", { result: result[0],resulT:resulT })
    
            }
        })
    }

   
})

router.post('/updateproduct', (req, res) => {
    console.log('BODY:', req.body)
    if(req.body.btn=="Edit"){
        pool.query('update products set productname=?,productmodel=?,category=?,gst=?,producttypeid=?,unitid=?,currencytype=?,price=?,offertype=?,offerrate=?,stock=? where productid=?', [req.body.productname, req.body.productmodel, req.body.category, req.body.gst, req.body.producttypeid, req.body.unitid, req.body.currencytype, req.body.price, req.body.offertype, req.body.offerrate, req.body.stock, req.body.productid], (error, result) => {
            if (error) {
                console.log(error);
                res.redirect("/home/displayproducts")
            } else {
                console.log(result)
                res.redirect("/home/displayproducts")
            }
        })
    }else{
        pool.query('delete from products where productid=?',[req.body.productid], (error, result) => {
            if (error) {
                console.log(error);
                res.redirect("/home/displayproducts")
            } else {
                console.log(result)
                res.redirect("/home/displayproducts")
            }
        })
    }
    
})

router.get('/editpicture',(req,res)=>{
    var resulT = JSON.parse(localstorage.getItem("ADMIN"));

    res.render('EditPicture',{data:req.query,resulT:resulT});
})

// ----------------------------------------
router.post('/uploadnewimage', upload.single('picture'), (req, res) => {
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);


    pool.query("update products set picture=? where productid=?", [req.filename,req.body.productid], (error, result) => {
        if (error) {
            console.log(error)
            res.redirect('/home/displayproducts')
        }
        else {
            console.log(result);
            res.redirect('/home/displayproducts')
        }
    })
})



router.get('/searchbyid', (req, res) => {
    var resulT = JSON.parse(localstorage.getItem("ADMIN"));
    if(resulT==null){
        res.render('adminlogin',{msg:""})
    }else{
       res.render("searchbyid",{message:"",resulT})
    }

   
})

module.exports = router;