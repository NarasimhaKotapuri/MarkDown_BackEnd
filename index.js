const express = require('express')
const cors = require('cors')
const multer = require('multer');
const path = require('path');
const fs = require('fs')

const app = express();
app.use(cors());
app.use(express.json());

const { parseMarkdown } = require('./parser')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Folder where files will be saved
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the filename
    },
});
const upload = multer({ storage });

app.get('/',(req, res)=>{
    res.send({
        message: 'success'
    })
})

app.post('/processFile',upload.single('file'),(req, res)=>{
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    let data = fs.readFileSync(req.file.path).toString()

    let htmlData = parseMarkdown(data)
    fs.unlinkSync(req.file.path)
    if(htmlData)
        res.status(200).json({ message: 'File uploaded successfully', html: htmlData });
    else res.status(200).json({ message: 'File uploaded successfully', html: 'Sorry, we are unable to process with this file!' });
})
app.listen(4000,()=>{
    console.log('backend server started');
})