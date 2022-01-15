var express = require('express');
var router = express.Router();
const pool = require('./pool');

var LocalStorage = require('node-localstorage').LocalStorage;
var localstorage = new LocalStorage('./scratch');


router.get('/adminlogin',(req,res)=>{
    res.render('adminlogin',{msg:""});
});

router.post('/checklogin',(req,res)=>{
    pool.query("select * from admins where emailid=? and password=?",[req.body.emailid,req.body.password],(error,result)=>{
        if(error){
            res.render('/adminlogin',{msg:"Server Error"})
        }else{
            if(result.length==1){
                localstorage.setItem('ADMIN',JSON.stringify(result[0]));
                res.render("dashboard",{result:result[0]})
            }else{
                res.render("adminlogin",{msg:"Invalid ID/Password"})
            }
        }
    })
})

router.get('/logout',(req,res)=>{
    localstorage.clear();
    localstorage.removeItem('ADMIN');
    res.render('adminlogin',{msg:"Login Again to Move forward"})
})


module.exports = router;
