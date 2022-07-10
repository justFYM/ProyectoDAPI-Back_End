import express from "express";
const router = express.Router();
router.get("/a", async(req,res)=>{
    fetch('https://7qak3a37b4dh7kisebhllubdxq0dnehm.lambda-url.us-east-1.on.aws')
    .then(response => response.json())
    .then(data => res.send(data))
    .catch(error => console.log('error:', error));
});

module.exports = router;