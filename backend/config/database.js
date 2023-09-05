const moongose = require('mongoose');

const connectDatabase =()=>{
    moongose.connect(process.env.DB_LOCAL_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(con =>{
        console.log(`DB Connected to the host : ${con.connection.host}`)
    })
}
module.exports = connectDatabase