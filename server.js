const express = require('express')
const mongoose = require('mongoose');
const { SingerModel } = require('./models/Singer')
const bodyParser = require('body-parser')
const upload = require('./lib/uploadfile.config');
const flash = require('connect-flash');
const session = require('express-session')
const app = express();

mongoose.connect('mongodb://localhost/singer1503',{
    useNewUrlParser:true,
    useCreateIndex:true
})
app.use(bodyParser.urlencoded({extended:false}))
app.set('view engine','ejs');
app.use(express.static('./public/'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))
app.use(flash())
app.use((req,res,next)=>{
    res.locals.error_message = req.flash('error_message');
    next();
})

app.get('/',(req,res)=>{
    SingerModel.find()
    .then(singers=>{
        res.render('index',{singers})
    })
    .catch(err=>console.log(err))
})

app.get('/add-singer',(req,res)=>{
    res.render('add')
})
app.post('/add-singer',(req,res)=>{
    upload.single('avatar')(req,res,err=>{
        if(err){
            req.flash('error_message',err.message)
            return res.redirect('/add-singer')
        }
        const { name, link } = req.body;
        const avatar = req.file;
        SingerModel.create({
            name,
            link,
            avatar: avatar.filename
        })
        .then(()=>{
            res.redirect('/');
        })
        .catch(err=>{
            req.flash('error_message',err.message)
            // return res.redirect('/add-singer')
        })
    })
})
app.get('/update/:id',(req,res)=>{
    const {id} = req.params
    //check id exixts in arrSinger
    
})
app.post('/update',(req,res)=>{
    const { id_singer, name, avatar, link } = req.body
    
})
app.get('/delete/:id',(req,res)=>{
    const id = req.params.id
    
})
const port = process.env.PORT || 3000
app.listen(port)
