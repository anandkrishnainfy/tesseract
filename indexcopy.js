const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const path = require("path");
const multer = require('multer');
var upload = multer({ dest: 'uploads/' })

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "public/uploads");
//     },
//     filename: function (req, file, cb) {
//       cb(
//         null,
//         file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//       );
//     },
//   });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });

app.use(express.json()); // for parsing application/json
  app.use(
    express.urlencoded({
      extended: true,
    })
  );  

app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
    console.log(req);
    console.log(res);
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
  });
    
app.post('/merge',upload.single('files'), function (req,res,next){
    console.log(req);
    console.log(res);
    // req.file is the `uploaded` file
  // req.body will hold the text fields, if there were any
});


app.listen(port, () => {
    console.log(`App is listening on Port ${port}`);
  });