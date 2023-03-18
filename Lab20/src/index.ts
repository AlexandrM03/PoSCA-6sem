import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import { engine } from 'express-handlebars';

import userRouter from './controllers/user.controller.js';
import driverRouter from './controllers/driver.controller.js';
import orderRouter from './controllers/order.controller.js';
import orderItemRouter from './controllers/orderItem.controller.js';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

app.engine('hbs', engine());
app.set('view engine', 'hbs');
app.set('views', './src/views');

app.use('/user', userRouter);
app.use('/driver', driverRouter);
app.use('/order', orderRouter);
app.use('/orderItem', orderItemRouter);

app.listen(port, () => {
	console.log(`server started at http://localhost:${port}`);
});