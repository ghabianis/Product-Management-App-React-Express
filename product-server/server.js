import express from "express";
import cors from "cors";
import mongoose, { Schema } from "mongoose";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from 'uuid';
import  multer from "multer";


// import jwt from "jsonwebtoken";
http://localhost:3000/
mongoose.connect('mongodb://127.0.0.1:27017/test')
  .then(() => console.log('Connected!'));
const app = express();


app.use(cors({
    origin: 'http://localhost:3000'
  }));
const mySchema = mongoose.model('products', new Schema({
    _id: Number,
    ref: String,
    libelle: String,
    prix: Number,
    image: String
  }));

  app.use('/public', express.static('public'));


  // parse application/json
app.use(bodyParser.json())


app.get('/getProducts',async (req,res)=>{
    try {
        const result = await mySchema.find({});
        return res.json({data:result});
    } catch (error) {
        return error;
    }
})

app.delete('/delete/:id',async (req,res)=>{
    const id = req.params.id;
        const result = await mySchema.deleteOne({ _id: id });
        return res.json({data : result , message : `product with id ${id} deleted successfully`});
})

app.get('/find/:id',async (req,res)=>{
    const id = req.params.id;
    try {
        const result = await mySchema.findById({ _id: id });
        return res.send(result);
    } catch (error) {
        return error;
    }

})


app.patch('/update/:id',async (req,res)=>{
    const id = req.params.id;
    const ref = req.body.ref;
    const libelle = req.body.libelle;
    const prix = req.body.prix;
    try {
        const result = await mySchema.updateOne({ _id: id }, { ref: ref , libelle :libelle , prix : prix });
        return res.json({result , message : "updated successfully"});
    } catch (error) {
        return error;
    }
})


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

app.post('/create', upload.single('image'), async (req, res) => {
    const { ref, libelle, prix } = req.body;
    const imagePath = req.file.path;
    const id = Math.random(1500);

    try {
        await mySchema.create({_id:id, ref, libelle, prix, image: imagePath });
        res.send({ message: "created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "An error occurred while creating the product" });
    }
});

app.use(cors());
app.listen(3005,()=>{
    console.log("server is running");

})