var methodoverride=require('method-override');
var express=require('express');
var app=express();
var body=require('body-parser');
app.use(body.urlencoded({extended:true}));
var exphbs=require('express-handlebars');
app.use(methodoverride('_method'));
app.set('views','views');
app.set('view engine','ejs');
const mongoose=require('mongoose');
mongoose.connect("mongodb://localhost/CRUD",{useNewUrlParser:true,useUnifiedTopology:true});
mongoose.set('useFindAndModify', false);
var Schema=mongoose.Schema
 var UserSchema=new Schema({
        name:{type:String},
        age:{type:Number},
        type:{type:String},
        runs:{type:Number},
     strike_rate:{type:Number},
     economy:{type:Number},
     wickets:{type:Number},
     captain:{type:String}
    });
const Crud=mongoose.model('crud',UserSchema);

var db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error'))
db.once('open',()=>{
    console.log('Connection successful to database')
});
app.get('/',function(req,res){
    Crud.find().then(reviews=>{
        res.render('index',{reviews:reviews,message:""});
    }).catch(err=>{
        console.log(err);
    });
});
app.get('/add.ejs',function(req,res){
    res.render('add');
})
app.get('/edit/:id',function(req,res){
    Crud.findById(req.params.id,function(err,review){
        console.log(review.name);
        res.render('edit.ejs',{review:review});
   
});
});
app.put('/edit/:id',function(req,res){
    Crud.findByIdAndUpdate(req.params.id,req.body).lean().then(review=>{
       res.redirect('/');
}).catch(err=>{
        console.log(err);
    });
});
app.get('/delete/:id',function(req,res){
    Crud.findById(req.params.id,function(err,review){
        console.log(review.name);
        res.render('delete.ejs',{review:review});
});
});

app.delete('/delete/:id',function(req,res){
    Crud.findByIdAndRemove(req.params.id).lean().then((review)=>{
        console.log(review.name);
        res.redirect('/');
    }).catch((err)=>{
        console.log(err);
    });
    });

app.post('/insert',function(req,res){
            var crud=new Crud({ name:req.body.name,
                      age:req.body.age,
        type:req.body.type,
        runs:req.body.runs,
        strike_rate:req.body.strike_rate,
        economy:req.body.economy,
        wickets:req.body.wickets,
        captain:req.body.captain})                     
               crud.save(()=>{
                   console.log('saved');
               });
                  res.redirect('/');
});
app.listen(3000,function(request,response){
            console.log("running successfully");
        });