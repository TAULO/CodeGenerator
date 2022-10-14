const    express     = require("express"),
mongoose    = require("mongoose"),
bodyparser  = require('body-parser'),
passport    = require("passport"),
localStratergy = require("passport-local"),
passportLocalMongoose = require("passport-local-mongoose"),
expressSession  = require("express-session"),
methodOverride = require("method-override");
require('dotenv').config()

//-------------------------- Edit for print -------------------------- 
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    secure: false, // use SSL
    service: 'Gmail',
    auth: {
    user: process.env.mailer_email,
    pass: process.env.mailer_pass
    },
    tls: {
    rejectUnauthorized: false
}
});


const path = require('path');
var   pp = require('./public/scripts/genPDF_server');
let fonts = {
    Roboto: {
        normal: 'node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf',
        bold: 'node_modules/roboto-font/fonts/Roboto/roboto-bold-webfont.ttf',
        italics: 'node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf',
        bolditalics: 'node_modules/roboto-font/fonts/Roboto/roboto-bolditalic-webfont.ttf'
    }
};
  
var PdfPrinter = require('pdfmake');
var printer = new PdfPrinter(fonts);
var fs = require('fs');
//----------------------- edit for print ends --------------------------------


var app = express();
app.use(bodyparser.json());
app.use(express.urlencoded({
  extended: true
}));

var subjectSchema = new mongoose.Schema({
    degree:String,
    course:String,
    type:String,
    number:Number,
    lecture:Number,
    tutorial:Number,
    practical:Number,
    percent:Number,
    years:Number,
    feedback:String,
    semester:String
})
const Subject = mongoose.model("Subject",subjectSchema);

var  innovSchema = new mongoose.Schema({
    title:String
})
const Innov = mongoose.model("Innov",innovSchema);


var  detailSchema = new mongoose.Schema({
    title:String,
    type:String
})
const Detail = mongoose.model("Detail",detailSchema);

var  instructSchema = new mongoose.Schema({
    title:String
})
const Instruct = mongoose.model("Instruct",instructSchema);

var  moocSchema = new mongoose.Schema({
    title:String,
    type:String
})
const Mooc = mongoose.model("Mooc",moocSchema);

var projectSchema = new mongoose.Schema({
    level:String,
    title:String,
    num:Number,
    name:String,
    super:String
})
const Project = mongoose.model("Project",projectSchema);

var phdSchema = new mongoose.Schema({
        name:String,
        year:Number,
        area:String,
        otherSup:String,
        number:Number,
        currStatus:String
})
const Phd = mongoose.model("Phd",phdSchema);

var journalSchema = new mongoose.Schema({
    author:String,
    title:String,
    journal:String,
    vol:Number,
    year:Number,
    page:Number,
    coauthor:String,
    status:String,
    areaofRes:String
})  
const Journal = mongoose.model("Journal",journalSchema);

var confSchema = new mongoose.Schema({
    author:String,
    title:String,
    confjournalName:String,
    year:Number,
    page:Number,
    coauthor:String,
    areaofRes:String
}) 
const Paper = mongoose.model("Paper",confSchema);

var bookSchema = new mongoose.Schema({
    author:String,
    title:String,
    publisher:String,
    volume:Number,
    year:Number,
    pages:Number,
    type:String  
})  
const Book = mongoose.model("Book",bookSchema);


var reportSchema = new mongoose.Schema({
    title:String,
    particulars:String,
    authors:String,
    remarks:String   
}) 
const Report = mongoose.model("Report",reportSchema);

var srpSchema = new mongoose.Schema({
    title:String,
    fundingAgency:String,
    financial:String,
    year:Number,
    period:Number,
    otherInvest:String,
    status:String
})  
const Srp = mongoose.model("Srp",srpSchema);

var cpSchema = new mongoose.Schema({
    title:String,
    fundingAgency:String,
    financial:String,
    year:Number,
    period:Number,
    otherInvest:String,
    status:String
})  
const Cp = mongoose.model("Cp",cpSchema);

var patentSchema = new mongoose.Schema({
    title:String,
    status:String,
    members:String
})
const Patent = mongoose.model("Patent",patentSchema);

var lectureSchema = new mongoose.Schema({
    title:String,
    date:String,
    place:String,
    programme:String,
    info:String
})  
const Lecture = mongoose.model("Lecture",lectureSchema);

var orgCourseSchema = new mongoose.Schema({
    title:String,
    type:String,
    sponsoredBy:String,
    date:String
})  
const OrgCourse = mongoose.model("OrgCourse",orgCourseSchema);

var stcSchema = new mongoose.Schema({
    title:String,
    type:String,
    sponsoredBy:String,
    date:String
})  
const Stc = mongoose.model("Stc",stcSchema);

var visitSchema = new mongoose.Schema({
    place:String,
    purpose:String,
    date:String,
})  
const Visit = mongoose.model("Visit",visitSchema);

var extensionSchema = new mongoose.Schema({
    title:String
}) 
const Extension = mongoose.model("Extension",extensionSchema);

var deptSchema = new mongoose.Schema({
    title:String
})  
const Dept = mongoose.model("Dept",deptSchema);

var instSchema = new mongoose.Schema({
    title:String
}) 
const Inst = mongoose.model("Inst",instSchema);

var assignmentSchema = new mongoose.Schema({
    title:String
})  
const Assignment = mongoose.model("Assignment",assignmentSchema);

var otherSchema = new mongoose.Schema({
    title:String
})  
const Other = mongoose.model("Other",otherSchema);

var selfSchema = new mongoose.Schema({
    comment:String
})
const Self = mongoose.model("Self",selfSchema);

var commentSchema = new mongoose.Schema({
    comment:String
})
const Comment = mongoose.model("Comment",commentSchema);

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    email: String,
    department: String,
    subjects:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:"Subject"
            }
    ],
    innovs:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Innov"
        }
    ],
    details:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Detail"
        }
    ],
    instructs:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Instruct"
        }
    ],
    moocs:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Mooc"
        }
    ],
    projects:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Project"
        }
    ],
    phds:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Phd"
        }
    ],
    journals:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Journal"
        }
    ],
    papers:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Paper"
        }
    ],
    books:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Book"
        }
    ],
    reports:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Report"
        }
    ],
    srps:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Srp"
        }
    ],
    cps:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Cp"
        }
    ],
    patents:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Patent"
        }
    ],
    lectures:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Lecture"
        }
    ],
    orgCourses:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"OrgCourse"
        }
    ],
    stcs:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Stc"
        }
    ],
    visits:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Visit"
        }
    ],
    extensions:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Extension"
        }
    ],
    depts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Dept"
        }
    ],
    insts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Inst"
        }
    ],
    assignments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Assignment"
        }
    ],
    others:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Other"
        }
    ],
    self:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Self"
        },

    comment:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        },
})
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User",userSchema);
const PORT = process.env.PORT || 3000;
// const URL = process.env.DATABASEURL || 'mongodb://localhost:27017/ACR';
// mongoose.connect(URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
// });

const URL = process.env.MONGO_URL;
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}).then(() => { console.log("DB Connected") }).catch((err) => console.log(err));
app.use(methodOverride("_method"));
app.set("view engine", 'ejs');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(express.static("public"));
app.use(expressSession({
    secret:"ACR key",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(userInfo);

passport.use(new localStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

function userInfo(req, res, next) {
    res.locals.currentUser = req.user;
    next();
  }
  var middleware = {
    isLoggedin: function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        //req.flash("error","You need to be logged in to do that");
        res.redirect("/login");
    }
};
app.get("/",function(req,res){
    res.render("login");
})
app.get("/index",middleware.isLoggedin,function(req,res){
    res.render("index");
})
//register
app.get("/register",function(req,res){
    res.render("register");
})
app.post("/register",function(req,res){
    var newUser = new User ({
        username    : req.body.username,
        name        : req.body.name,
        email       : req.body.email,
        department  : req.body.department     
    });
    console.log(req.body);
    User.register(newUser,req.body.password,function(err,user){
        
        if(err){
            
            console.log("error herr "+ err.message);

           // req.flash("error",err.message);
            res.redirect("/register");
        }
        else {
        passport.authenticate("local")(req,res,function(){
           // req.flash("success","Signed up as "+user.username);
            res.redirect("/index");
        })}
    })
})
//login
app.get("/login",function(req,res){
    res.render("login");
})
app.post("/login",passport.authenticate("local",{
    successRedirect : "/index",
  //  failureFlash : true,
    failureRedirect : "/login",
    
}),function(req,res){
    if(err){
        console.log(err.message);
      //  req.flash("error",err.message);
        res.redirect("/login");
    }
})

//logout
app.get("/logout",function(req,res){
    req.logout();
  //  req.flash("success","Logged out succcessfully!!");
    res.redirect("/login");
})

//Teaching engagement routes
app.get("/teaching",function(req,res){
    User.findById(req.user._id)
    .populate('subjects')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            res.send({subjects:user.subjects});
        }
    });
});
app.post("/teaching",function(req,res){
    
    User.findById(req.user._id,function(err,foundUser){
        if(err){
            console.log(err);
        }else {
            Subject.create(req.body,function(err,subject){
                if(err)
                console.log(err);
                else{
                    console.log(req.body);
                    subject.save();
                    foundUser.subjects.push(subject);
                    foundUser.save();
                    res.send({subjects:foundUser.subjects});
                }
            })            
        }
    })    
})
app.delete("/teaching/:course",function(req,res){
    var course = req.params.course;
    console.log(course);
    User.findById(req.user._id)
    .populate('subjects')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            
            user.subjects.forEach(function(subject,index){
                if(subject.course === course){
                    console.log("found a match");
                    let id = subject._id;
                    Subject.findByIdAndDelete(subject._id,function(err){
                        if(err){
                            console.log(err);
                        }
                        else console.log("deleted");
                    })
                    user.subjects.splice(index,1);
                }
            });
            user.save();
            res.send({subjects:user.subjects});
        }
    });
    
})
//Innnovation routes
app.get("/innov",function(req,res){
    User.findById(req.user._id)
    .populate('innovs')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            res.send({innovs:user.innovs});
        }
    });
})
app.post("/innov",function(req,res){
    User.findById(req.user._id,function(err,foundUser){
        if(err){
            console.log(err);
        }else {
            Innov.create(req.body,function(err,innov){
                if(err)
                console.log(err);
                else{
                    console.log(req.body);
                    innov.save();
                    foundUser.innovs.push(innov);
                    foundUser.save();
                    res.send({innovs:foundUser.innovs});
                }
            })            
        }
    }) 
})
app.delete("/innov/:title",function(req,res){
    var title = req.params.title;

    User.findById(req.user._id)
    .populate('innovs')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            
            user.innovs.forEach(function(innov,index){
                if(innov.title === title){
                    console.log("found a match");
                    let id = innov._id;
                    Innov.findByIdAndDelete(innov._id,function(err){
                        if(err){
                            console.log(err);
                        }
                        else console.log("deleted");
                    })
                    user.innovs.splice(index,1);
                }
            });
            user.save();
            res.send({innovs:user.innovs});
        }
    });
})
//Details routes
app.get("/detail",function(req,res){
    User.findById(req.user._id)
    .populate('details')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            res.send({details:user.details});
        }
    });
})
app.post("/detail",function(req,res){
    User.findById(req.user._id,function(err,foundUser){
        if(err){
            console.log(err);
        }else {
            Detail.create(req.body,function(err,detail){
                if(err)
                console.log(err);
                else{
                    console.log(req.body);
                    detail.save();
                    foundUser.details.push(detail);
                    foundUser.save();
                    res.send({details:foundUser.details});
                }
            })            
        }
    }) 
})
app.delete("/detail/:title",function(req,res){
    var title = req.params.title;

    User.findById(req.user._id)
    .populate('details')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            
            user.details.forEach(function(detail,index){
                if(detail.title === title){
                    console.log("found a match");
                    let id = detail._id;
                    Detail.findByIdAndDelete(detail._id,function(err){
                        if(err){
                            console.log(err);
                        }
                        else console.log("deleted");
                    })
                    user.details.splice(index,1);
                }
            });
            user.save();
            res.send({details:user.details});
        }
    });  
})
//Instruct Routes
app.get("/instruct",function(req,res){
    User.findById(req.user._id)
    .populate('instructs')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            res.send({instructs:user.instructs});
        }
    });
})
app.post("/instruct",function(req,res){
    User.findById(req.user._id,function(err,foundUser){
        if(err){
            console.log(err);
        }else {
            Instruct.create(req.body,function(err,instruct){
                if(err)
                console.log(err);
                else{
                    console.log(req.body);
                    instruct.save();
                    foundUser.instructs.push(instruct);
                    foundUser.save();
                    res.send({instructs:foundUser.instructs});
                }
            })            
        }
    }) 
})
app.delete("/instruct/:title",function(req,res){
    var title = req.params.title;

    User.findById(req.user._id)
    .populate('instructs')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            
            user.instructs.forEach(function(instruct,index){
                if(instruct.title === title){
                    console.log("found a match");
                    let id = instruct._id;
                    Instruct.findByIdAndDelete(instruct._id,function(err){
                        if(err){
                            console.log(err);
                        }
                        else console.log("deleted");
                    })
                    user.instructs.splice(index,1);
                }
            });
            user.save();
            res.send({instructs:user.instructs});
        }
    });
    
})

//MOOC Routes
app.get("/mooc",function(req,res){
    User.findById(req.user._id)
    .populate('moocs')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            res.send({moocs:user.moocs});
        }
    });
})
app.post("/mooc",function(req,res){
    User.findById(req.user._id,function(err,foundUser){
        if(err){
            console.log(err);
        }else {
            Mooc.create(req.body,function(err,mooc){
                if(err)
                console.log(err);
                else{
                    console.log(req.body);
                    mooc.save();
                    foundUser.moocs.push(mooc);
                    foundUser.save();
                    res.send({moocs:foundUser.moocs});
                }
            })            
        }
    }) 
})
app.delete("/mooc/:title",function(req,res){
    var title = req.params.title;

    User.findById(req.user._id)
    .populate('moocs')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            
            user.moocs.forEach(function(mooc,index){
                if(mooc.title === title){
                    console.log("found a match");
                    let id = mooc._id;
                    Mooc.findByIdAndDelete(mooc._id,function(err){
                        if(err){
                            console.log(err);
                        }
                        else console.log("deleted");
                    })
                    user.moocs.splice(index,1);
                }
            });
            user.save();
            res.send({moocs:user.moocs});
        }
    });
    
})


//Project Routes

app.get("/project",function(req,res){
    User.findById(req.user._id)
    .populate('projects')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            res.send({projects:user.projects});
        }
    });
})
app.post("/project",function(req,res){
    User.findById(req.user._id,function(err,foundUser){
        if(err){
            console.log(err);
        }else {
            Project.create(req.body,function(err,project){
                if(err)
                console.log(err);
                else{
                    console.log(req.body);
                    project.save();
                    foundUser.projects.push(project);
                    foundUser.save();
                    res.send({projects:foundUser.projects});
                }
            })            
        }
    }) 
})
app.delete("/project/:title",function(req,res){
    var title = req.params.title;

    User.findById(req.user._id)
    .populate('projects')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            
            user.projects.forEach(function(project,index){
                if(project.title === title){
                    console.log("found a match");
                    let id = project._id;
                    Project.findByIdAndDelete(project._id,function(err){
                        if(err){
                            console.log(err);
                        }
                        else console.log("deleted");
                    })
                    user.projects.splice(index,1);
                }
            });
            user.save();
            res.send({projects:user.projects});
        }
    });
    
})

//PHD Routes

app.get("/phd",function(req,res){
    User.findById(req.user._id)
    .populate('phds')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            res.send({phds:user.phds});
        }
    });
})
app.post("/phd",function(req,res){
    User.findById(req.user._id,function(err,foundUser){
        if(err){
            console.log(err);
        }else {
            Phd.create(req.body,function(err,phd){
                if(err)
                console.log(err);
                else{
                    console.log(req.body);
                    phd.save();
                    foundUser.phds.push(phd);
                    foundUser.save();
                    res.send({phds:foundUser.phds});
                }
            })            
        }
    }) 
})
app.delete("/phd/:title",function(req,res){
    var title = req.params.title;

    User.findById(req.user._id)
    .populate('phds')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            
            user.phds.forEach(function(phd,index){
                if(phd.name === title){
                    console.log("found a match");
                    let id = phd._id;
                    Phd.findByIdAndDelete(phd._id,function(err){
                        if(err){
                            console.log(err);
                        }
                        else console.log("deleted");
                    })
                    user.phds.splice(index,1);
                }
            });
            user.save();
            res.send({phds:user.phds});
        }
    });
    
})

//Journal Routes
app.get("/journal",function(req,res){
    User.findById(req.user._id)
    .populate('journals')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            res.send({journals:user.journals});
        }
    });
})
app.post("/journal",function(req,res){
    User.findById(req.user._id,function(err,foundUser){
        if(err){
            console.log(err);
        }else {
            Journal.create(req.body,function(err,journal){
                if(err)
                console.log(err);
                else{
                    console.log(req.body);
                    journal.save();
                    foundUser.journals.push(journal);
                    foundUser.save();
                    res.send({journals:foundUser.journals});
                }
            })            
        }
    }) 
})
app.delete("/journal/:title",function(req,res){
    var title = req.params.title;

    User.findById(req.user._id)
    .populate('journals')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            
            user.journals.forEach(function(journal,index){
                if(journal.title === title){
                    console.log("found a match");
                    let id = journal._id;
                    Journal.findByIdAndDelete(journal._id,function(err){
                        if(err){
                            console.log(err);
                        }
                        else console.log("deleted");
                    })
                    user.journals.splice(index,1);
                }
            });
            user.save();
            res.send({journals:user.journals});
        }
    });
    
})


//Conference paper Routes
app.get("/paper",function(req,res){
    User.findById(req.user._id)
    .populate('papers')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            res.send({papers:user.papers});
        }
    });
})
app.post("/paper",function(req,res){
    User.findById(req.user._id,function(err,foundUser){
        if(err){
            console.log(err);
        }else {
            Paper.create(req.body,function(err,paper){
                if(err)
                console.log(err);
                else{
                    console.log(req.body);
                    paper.save();
                    foundUser.papers.push(paper);
                    foundUser.save();
                    res.send({papers:foundUser.papers});
                }
            })            
        }
    }) 
})
app.delete("/paper/:title",function(req,res){
    var title = req.params.title;

    User.findById(req.user._id)
    .populate('papers')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            
            user.papers.forEach(function(paper,index){
                if(paper.title === title){
                    console.log("found a match");
                    let id = paper._id;
                    Paper.findByIdAndDelete(paper._id,function(err){
                        if(err){
                            console.log(err);
                        }
                        else console.log("deleted");
                    })
                    user.papers.splice(index,1);
                }
            });
            user.save();
            res.send({papers:user.papers});
        }
    });
    
})

//Books Routes
app.get("/book",function(req,res){
    User.findById(req.user._id)
    .populate('books')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            res.send({books:user.books});
        }
    });
})
app.post("/book",function(req,res){
    User.findById(req.user._id,function(err,foundUser){
        if(err){
            console.log(err);
        }else {
            Book.create(req.body,function(err,book){
                if(err)
                console.log(err);
                else{
                    console.log(req.body);
                    book.save();
                    foundUser.books.push(book);
                    foundUser.save();
                    res.send({books:foundUser.books});
                }
            })            
        }
    }) 
})
app.delete("/book/:title",function(req,res){
    var title = req.params.title;

    User.findById(req.user._id)
    .populate('books')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            
            user.books.forEach(function(book,index){
                if(book.title === title){
                    console.log("found a match");
                    let id = book._id;
                    Book.findByIdAndDelete(book._id,function(err){
                        if(err){
                            console.log(err);
                        }
                        else console.log("deleted");
                    })
                    user.books.splice(index,1);
                }
            });
            user.save();
            res.send({books:user.books});
        }
    });
    
})

//Reports Routes
app.get("/report",function(req,res){
    User.findById(req.user._id)
    .populate('reports')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            res.send({reports:user.reports});
        }
    });
})
app.post("/report",function(req,res){
    User.findById(req.user._id,function(err,foundUser){
        if(err){
            console.log(err);
        }else {
            Report.create(req.body,function(err,report){
                if(err)
                console.log(err);
                else{
                    console.log(req.body);
                    report.save();
                    foundUser.reports.push(report);
                    foundUser.save();
                    res.send({reports:foundUser.reports});
                }
            })            
        }
    }) 
})
app.delete("/report/:title",function(req,res){
    var title = req.params.title;

    User.findById(req.user._id)
    .populate('reports')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            
            user.reports.forEach(function(report,index){
                if(report.title === title){
                    console.log("found a match");
                    let id = report._id;
                    Report.findByIdAndDelete(report._id,function(err){
                        if(err){
                            console.log(err);
                        }
                        else console.log("deleted");
                    })
                    user.reports.splice(index,1);
                }
            });
            user.save();
            res.send({reports:user.reports});
        }
    });
    
})

//Sponsored Reasearch Projects Routes
app.get("/srp",function(req,res){
    User.findById(req.user._id)
    .populate('srps')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            res.send({srps:user.srps});
        }
    });
})
app.post("/srp",function(req,res){
    User.findById(req.user._id,function(err,foundUser){
        if(err){
            console.log(err);
        }else {
            Srp.create(req.body,function(err,srp){
                if(err)
                console.log(err);
                else{
                    console.log(req.body);
                    srp.save();
                    foundUser.srps.push(srp);
                    foundUser.save();
                    res.send({srps:foundUser.srps});
                }
            })            
        }
    }) 
})
app.delete("/srp/:title",function(req,res){
    var title = req.params.title;

    User.findById(req.user._id)
    .populate('srps')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            
            user.srps.forEach(function(srp,index){
                if(srp.title === title){
                    console.log("found a match");
                    let id = srp._id;
                    Srp.findByIdAndDelete(srp._id,function(err){
                        if(err){
                            console.log(err);
                        }
                        else console.log("deleted");
                    })
                    user.srps.splice(index,1);
                }
            });
            user.save();
            res.send({srps:user.srps});
        }
    });
    
})

//CP Routes
app.get("/cp",function(req,res){
    User.findById(req.user._id)
    .populate('cps')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            res.send({cps:user.cps});
        }
    });
})
app.post("/cp",function(req,res){
    User.findById(req.user._id,function(err,foundUser){
        if(err){
            console.log(err);
        }else {
            Cp.create(req.body,function(err,cp){
                if(err)
                console.log(err);
                else{
                    console.log(req.body);
                    cp.save();
                    foundUser.cps.push(cp);
                    foundUser.save();
                    res.send({cps:foundUser.cps});
                }
            })            
        }
    }) 
})
app.delete("/cp/:title",function(req,res){
    var title = req.params.title;

    User.findById(req.user._id)
    .populate('cps')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            
            user.cps.forEach(function(cp,index){
                if(cp.title === title){
                    console.log("found a match");
                    let id = cp._id;
                    Cp.findByIdAndDelete(cp._id,function(err){
                        if(err){
                            console.log(err);
                        }
                        else console.log("deleted");
                    })
                    user.cps.splice(index,1);
                }
            });
            user.save();
            res.send({cps:user.cps});
        }
    });
    
})

//Patent Routes
app.get("/patent",function(req,res){
    User.findById(req.user._id)
    .populate('patents')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            res.send({patents:user.patents});
        }
    });
})
app.post("/patent",function(req,res){
    User.findById(req.user._id,function(err,foundUser){
        if(err){
            console.log(err);
        }else {
            Patent.create(req.body,function(err,patent){
                if(err)
                console.log(err);
                else{
                    console.log(req.body);
                    patent.save();
                    foundUser.patents.push(patent);
                    foundUser.save();
                    res.send({patents:foundUser.patents});
                }
            })            
        }
    }) 
})
app.delete("/patent/:title",function(req,res){
    var title = req.params.title;

    User.findById(req.user._id)
    .populate('patents')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            
            user.patents.forEach(function(patent,index){
                if(patent.title === title){
                    console.log("found a match");
                    let id = patent._id;
                    Patent.findByIdAndDelete(patent._id,function(err){
                        if(err){
                            console.log(err);
                        }
                        else console.log("deleted");
                    })
                    user.patents.splice(index,1);
                }
            });
            user.save();
            res.send({patents:user.patents});
        }
    });
    
})


//Lecture Routes
app.get("/lecture",function(req,res){
    User.findById(req.user._id)
    .populate('lectures')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            res.send({lectures:user.lectures});
        }
    });
})
app.post("/lecture",function(req,res){
    User.findById(req.user._id,function(err,foundUser){
        if(err){
            console.log(err);
        }else {
            Lecture.create(req.body,function(err,lecture){
                if(err)
                console.log(err);
                else{
                    console.log(req.body);
                    lecture.save();
                    foundUser.lectures.push(lecture);
                    foundUser.save();
                    res.send({lectures:foundUser.lectures});
                }
            })            
        }
    }) 
})
app.delete("/lecture/:title",function(req,res){
    var title = req.params.title;

    User.findById(req.user._id)
    .populate('lectures')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            
            user.lectures.forEach(function(lecture,index){
                if(lecture.title === title){
                    console.log("found a match");
                    let id = lecture._id;
                    Lecture.findByIdAndDelete(lecture._id,function(err){
                        if(err){
                            console.log(err);
                        }
                        else console.log("deleted");
                    })
                    user.lectures.splice(index,1);
                }
            });
            user.save();
            res.send({lectures:user.lectures});
        }
    });
    
})

//Organised Courses Routes
app.get("/orgCourse",function(req,res){
    User.findById(req.user._id)
    .populate('orgCourses')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            res.send({orgCourses:user.orgCourses});
        }
    });
})
app.post("/orgCourse",function(req,res){
    User.findById(req.user._id,function(err,foundUser){
        if(err){
            console.log(err);
        }else {
            OrgCourse.create(req.body,function(err,orgCourse){
                if(err)
                console.log(err);
                else{
                    console.log(req.body);
                    orgCourse.save();
                    foundUser.orgCourses.push(orgCourse);
                    foundUser.save();
                    res.send({orgCourses:foundUser.orgCourses});
                }
            })            
        }
    }) 
})
app.delete("/orgCourse/:title",function(req,res){
    var title = req.params.title;

    User.findById(req.user._id)
    .populate('orgCourses')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            
            user.orgCourses.forEach(function(orgCourse,index){
                if(orgCourse.title === title){
                    console.log("found a match");
                    let id = orgCourse._id;
                    OrgCourse.findByIdAndDelete(orgCourse._id,function(err){
                        if(err){
                            console.log(err);
                        }
                        else console.log("deleted");
                    })
                    user.orgCourses.splice(index,1);
                }
            });
            user.save();
            res.send({orgCourses:user.orgCourses});
        }
    });
    
})


//Participated STC Routes
app.get("/stc",function(req,res){
    User.findById(req.user._id)
    .populate('stcs')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            res.send({stcs:user.stcs});
        }
    });
})
app.post("/stc",function(req,res){
    User.findById(req.user._id,function(err,foundUser){
        if(err){
            console.log(err);
        }else {
            Stc.create(req.body,function(err,stc){
                if(err)
                console.log(err);
                else{
                    console.log(req.body);
                    stc.save();
                    foundUser.stcs.push(stc);
                    foundUser.save();
                    res.send({stcs:foundUser.stcs});
                }
            })            
        }
    }) 
})
app.delete("/stc/:title",function(req,res){
    var title = req.params.title;

    User.findById(req.user._id)
    .populate('stcs')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            
            user.stcs.forEach(function(stc,index){
                if(stc.title === title){
                    console.log("found a match");
                    let id = stc._id;
                    Stc.findByIdAndDelete(stc._id,function(err){
                        if(err){
                            console.log(err);
                        }
                        else console.log("deleted");
                    })
                    user.stcs.splice(index,1);
                }
            });
            user.save();
            res.send({stcs:user.stcs});
        }
    });
})

//Places visited Routes
app.get("/visit",function(req,res){
    User.findById(req.user._id)
    .populate('visits')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            res.send({visits:user.visits});
        }
    });
})
app.post("/visit",function(req,res){
    User.findById(req.user._id,function(err,foundUser){
        if(err){
            console.log(err);
        }else {
            Visit.create(req.body,function(err,visit){
                if(err)
                console.log(err);
                else{
                    console.log(req.body);
                    visit.save();
                    foundUser.visits.push(visit);
                    foundUser.save();
                    res.send({visits:foundUser.visits});
                }
            })            
        }
    }) 
})
app.delete("/visit/:title",function(req,res){
    var title = req.params.title;

    User.findById(req.user._id)
    .populate('visits')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            
            user.visits.forEach(function(visit,index){
                if(visit.place === title){
                    console.log("found a match");
                    let id = visit._id;
                    Visit.findByIdAndDelete(visit._id,function(err){
                        if(err){
                            console.log(err);
                        }
                        else console.log("deleted");
                    })
                    user.visits.splice(index,1);
                }
            });
            user.save();
            res.send({visits:user.visits});
        }
    });
    
})

//Extension Routes
app.get("/extension",function(req,res){
    User.findById(req.user._id)
    .populate('extensions')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            res.send({extensions:user.extensions});
        }
    });
})
app.post("/extension",function(req,res){
    User.findById(req.user._id,function(err,foundUser){
        if(err){
            console.log(err);
        }else {
            Extension.create(req.body,function(err,extension){
                if(err)
                console.log(err);
                else{
                    console.log(req.body);
                    extension.save();
                    foundUser.extensions.push(extension);
                    foundUser.save();
                    res.send({extensions:foundUser.extensions});
                }
            })            
        }
    }) 
})
app.delete("/extension/:title",function(req,res){
    var title = req.params.title;

    User.findById(req.user._id)
    .populate('extensions')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            
            user.extensions.forEach(function(extension,index){
                if(extension.title === title){
                    console.log("found a match");
                    let id = extension._id;
                    Extension.findByIdAndDelete(extension._id,function(err){
                        if(err){
                            console.log(err);
                        }
                        else console.log("deleted");
                    })
                    user.extensions.splice(index,1);
                }
            });
            user.save();
            res.send({extensions:user.extensions});
        }
    });
    
})


//Department Responsibilities Extension Routes
app.get("/departmentResp",function(req,res){
    User.findById(req.user._id)
    .populate('depts')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            res.send({departmentResps:user.depts});
        }
    });
})
app.post("/departmentResp",function(req,res){
    User.findById(req.user._id,function(err,foundUser){
        if(err){
            console.log(err);
        }else {
            Dept.create(req.body,function(err,dept){
                if(err)
                console.log(err);
                else{
                    console.log(req.body);
                    dept.save();
                    foundUser.depts.push(dept);
                    foundUser.save();
                    res.send({departmentResps:foundUser.depts});
                }
            })            
        }
    }) 
})
app.delete("/departmentResp/:title",function(req,res){
    var title = req.params.title;

    User.findById(req.user._id)
    .populate('depts')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            
            user.depts.forEach(function(dept,index){
                if(dept.title === title){
                    console.log("found a match");
                    let id = dept._id;
                    Dept.findByIdAndDelete(dept._id,function(err){
                        if(err){
                            console.log(err);
                        }
                        else console.log("deleted");
                    })
                    user.depts.splice(index,1);
                }
            });
            user.save();
            res.send({departmentResps:user.depts});
        }
    });
    
})


//Institute Responsibilities Extension Routes
app.get("/insituteResp",function(req,res){
    User.findById(req.user._id)
    .populate('insts')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            res.send({insituteResps:user.insts});
        }
    });
})
app.post("/insituteResp",function(req,res){
    User.findById(req.user._id,function(err,foundUser){
        if(err){
            console.log(err);
        }else {
            Inst.create(req.body,function(err,inst){
                if(err)
                console.log(err);
                else{
                    console.log(req.body);
                    inst.save();
                    foundUser.insts.push(inst);
                    foundUser.save();
                    res.send({insituteResps:foundUser.insts});
                }
            })            
        }
    }) 
})
app.delete("/insituteResp/:title",function(req,res){
    var title = req.params.title;

    User.findById(req.user._id)
    .populate('insts')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            
            user.insts.forEach(function(inst,index){
                if(inst.title === title){
                    console.log("found a match");
                    let id = inst._id;
                    Inst.findByIdAndDelete(inst._id,function(err){
                        if(err){
                            console.log(err);
                        }
                        else console.log("deleted");
                    })
                    user.insts.splice(index,1);
                }
            });
            user.save();
            res.send({insituteResps:user.insts});
        }
    });
    
})

//Other Assignments Extension Routes
app.get("/assignment",function(req,res){
    User.findById(req.user._id)
    .populate('assignments')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            res.send({assignments:user.assignments});
        }
    });
})
app.post("/assignment",function(req,res){
    User.findById(req.user._id,function(err,foundUser){
        if(err){
            console.log(err);
        }else {
            Assignment.create(req.body,function(err,assignment){
                if(err)
                console.log(err);
                else{
                    console.log(req.body);
                    assignment.save();
                    foundUser.assignments.push(assignment);
                    foundUser.save();
                    res.send({assignments:foundUser.assignments});
                }
            })            
        }
    }) 
})
app.delete("/assignment/:title",function(req,res){
    var title = req.params.title;

    User.findById(req.user._id)
    .populate('assignments')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            
            user.assignments.forEach(function(assignment,index){
                if(assignment.title === title){
                    console.log("found a match");
                    let id = assignment._id;
                    Assignment.findByIdAndDelete(assignment._id,function(err){
                        if(err){
                            console.log(err);
                        }
                        else console.log("deleted");
                    })
                    user.assignments.splice(index,1);
                }
            });
            user.save();
            res.send({assignments:user.assignments});
        }
    });
    
})



//Any Other Work (NOT MENTIONED ABOVE) Routes
app.get("/other",function(req,res){
    User.findById(req.user._id)
    .populate('others')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            res.send({others:user.others});
        }
    });
})
app.post("/other",function(req,res){
    User.findById(req.user._id,function(err,foundUser){
        if(err){
            console.log(err);
        }else {
            Other.create(req.body,function(err,other){
                if(err)
                console.log(err);
                else{
                    console.log(req.body);
                    other.save();
                    foundUser.others.push(other);
                    foundUser.save();
                    res.send({others:foundUser.others});
                }
            })            
        }
    }) 
})
app.delete("/other/:title",function(req,res){
    var title = req.params.title;

    User.findById(req.user._id)
    .populate('others')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            
            user.others.forEach(function(other,index){
                if(other.title === title){
                    console.log("found a match");
                    let id = other._id;
                    Other.findByIdAndDelete(other._id,function(err){
                        if(err){
                            console.log(err);
                        }
                        else console.log("deleted");
                    })
                    user.others.splice(index,1);
                }
            });
            user.save();
            res.send({others:user.others});
        }
    });
})

//Self appraisel
app.get("/self",function(req,res){
    User.findById(req.user._id)
    .populate('self')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            res.send({self:user.self});
        }
    });
})
app.post("/self",function(req,res){
    User.findById(req.user._id,function(err,foundUser){
        if(err){
            console.log(err);
        }else {
            Self.create(req.body,function(err,self){
                if(err)
                console.log(err);
                else{
                    console.log(req.body);
                    self.save();
                    foundUser.self = self;
                    foundUser.save();
                    res.send({self:foundUser.self});
                }
            })            
        }
    }) 
})
//COMMENT 
app.get("/comment",function(req,res){
    User.findById(req.user._id)
    .populate('comment')
    .exec(function(err,user){
        if(err){
            console.log(err);
        }else {
            console.log(user);
            res.send({comment:user.comment});
        }
    });
})
app.post("/comment",function(req,res){
    User.findById(req.user._id,function(err,foundUser){
        if(err){
            console.log(err);
        }else {
            Comment.create(req.body,function(err,comment){
                if(err)
                console.log(err);
                else{
                    console.log(req.body);
                    comment.save();
                    foundUser.comment = comment;
                    foundUser.save();
                    res.send({comment:foundUser.comment});
                }
            })            
        }
    }) 
})


//------------------------ print function ------------------------
function fileExist(fullpath) {
    try {
        return fs.statSync(fullpath).isFile();
    } catch (e) {
        return false;
    }
}


app.get("/printNode", middleware.isLoggedin,function (req, res) {

    var iNeed;
    User.findById(req.user._id)
        .populate('subjects')
        .populate('innovs')
        .populate('details')
        .populate('instructs')
        .populate('moocs')
        .populate('projects')
        .populate('phds')
        .populate('journals')
        .populate('papers')
        .populate('books')
        .populate('reports')
        .populate('srps')
        .populate('cps')
        .populate('patents')
        .populate('lectures')
        .populate('orgCourses')
        .populate('stcs')
        .populate('visits')
        .populate('extensions')
        .populate('depts')
        .populate('insts')
        .populate('assignments')
        .populate('others')
        .populate('self')
        .populate('comment')
        .exec(function (err, user) {
            if (err) {
                console.log(err);
            } else {
                iNeed = user;
                //console.log(iNeed.instructs);

                var docDefinition = pp.getDD(iNeed);
                ////////////////////////////////
                var uname = iNeed.username;
                var name = iNeed.name;
                var dept = iNeed.department;
                var emailRec = iNeed.email;
                var currentUser = `${uname}_${dept}_${name}`;


                //Don't Touch below code

                var options = {};
                const fname = currentUser + '.pdf';
                const fpath = './files/';
                const filePath = fpath + fname;

                var pdfDoc = printer.createPdfKitDocument(docDefinition, options);
                pdfDoc.pipe(fs.createWriteStream(path.join(__dirname, fpath, fname)));
                pdfDoc.end();

                if (fileExist(filePath)) {

                    var mailOptions = {
                        from: 'acr.nitj@gmail.com',
                        to: emailRec,
                        subject: `ACR Document : (${name})`,
                        text: `Hey ${name}, here's your requested document.\nHave a nice day\n - System`,
                        attachments: [{
                            path: filePath
                        }]
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                            res.render('error.ejs');
                        } else {
                            console.log('Email sent: ' + info.response);
                            res.render('emailSent.ejs');
                        }
                    });

                } else {
                    console.log("file does't exist");
                    res.render('error.ejs');
                }

            }
        });


})


app.get("/score",middleware.isLoggedin, function (req, res) {


    User.findById(req.user._id)
        .populate('subjects')
        .populate('innovs')
        .populate('details')
        .populate('instructs')
        .populate('moocs')
        .populate('projects')
        .populate('phds')
        .populate('journals')
        .populate('papers')
        .populate('books')
        .populate('reports')
        .populate('srps')
        .populate('cps')
        .populate('patents')
        .populate('lectures')
        .populate('orgCourses')
        .populate('stcs')
        .populate('visits')
        .populate('extensions')
        .populate('depts')
        .populate('insts')
        .populate('assignments')
        .populate('others')
        .populate('self')
        .populate('comment')
        .exec(function (err, user) {
            if (err) {
                console.log(err);
            } else {
                res.render("score", { user: user })
            }


        });
})
// ------------------------ print function ---------------------



app.listen(process.env.PORT || PORT,function(){
    console.log("Server running! At Port 3000 http://localhost:3000/");
})