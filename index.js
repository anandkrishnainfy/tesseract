const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const path = require("path");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');

const spawnObj = require('child_process').spawn;
const Tesseract = require("tesseract.js");


/** Permissible loading a single file, 
    the value of the attribute "name" in the form of "recfile". **/

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });

app.use(express.json()); // for parsing application/json
  app.use(
    express.urlencoded({
      extended: true,
    })
  );  
// static method is helpful to access the class/file with out creating its object
  app.use(express.static("uploads"));  

// app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
//     console.log(req);
//     console.log(res);
//     // req.files is array of `photos` files
//     // req.body will contain the text fields, if there were any
//   });
   
/* upload a single file */

app.post('/merge',upload.single('imgfile'), function (req,res,next){

    console.log(req.file);
    console.log(req.body);
    /** When using the "single"
      data come in "req.file" regardless of the attribute "name". **/
    var tmp_path = req.file.path;

    /** The original name of the uploaded file
      stored in the variable "originalname". **/
    var target_path = 'uploads/' + req.file.originalname;

     /** A better way to copy the uploaded file. **/
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);
    src.pipe(dest);
    //res.render stuff will throw an error if you're not using a view engine.
    // res.json() you can send any generic data
    
    //src.on('end', function() {res.json("file got copied successfully in the uploads folder") });
    src.on('error', function(err) { res.json({ message: err.message, error: err }) });

    Tesseract.recognize(

        // this first argument is for the location of an image it can be a
        src.path,
    
        // this second argument is for the laguage
        'eng',
    
        { logger: m => console.log(m) },
    ).then(({ data: { text } }) => {
        console.log(text);
        fs.writeFile('OCR_Response.txt', text, (err,success) => {
            // error case
            if (err) {
                throw err;
                console.log('Encountered error');
            }
            // success case
            else {
                res.status(200).json({status: 'success', data:text});
                console.log('File saved')
                spawnObj('C:\\windows\\notepad.exe', ["OCR_Response.txt"]);
            }
        })
    }
    );
        
    // req.file is the `uploaded` file
  // req.body will hold the text fields, if there were any
});


app.listen(port, () => {
    console.log(`App is listening on Port ${port}`);
  });