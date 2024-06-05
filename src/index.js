import app from './app.js';
import { connectDB } from './db.js';

connectDB();
app.listen(5000);
console.log('Servidor escuchando por el puerto: ',5000);

// connectDB();
// //const port = process.env.PORT || 4000;
// app.listen(4000)
// console.log('Server escuchando por el puerto: ',4000)
// //app.listen(port,()=> console.log('Server escuchando por el puerto: ',port))
