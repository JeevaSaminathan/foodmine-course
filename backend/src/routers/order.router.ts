import { Router } from "express";
import asyncHander from 'express-async-handler';
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import { OrderModel } from "../models/order.model";
import { OrderStatus } from "../constants/order_status";
import auth from '../middlewares/auth.mid';

const router = Router();
router.use(auth);

router.post('/create',
asyncHander(async (req:any, res:any) => {
    const requestOrder = req.body;

    if(requestOrder.items.length <= 0){
        res.status(HTTP_BAD_REQUEST).send('Cart Is Empty!');
        return;
    }

    await OrderModel.deleteOne({
        user: req.user.id,
        status: OrderStatus.NEW
    });

    const newOrder = new OrderModel({...requestOrder,user: req.user.id});
    await newOrder.save();
    res.send(newOrder);
})
)


router.get('/newOrderForCurrentUser', asyncHander( async (req:any,res ) => {
    const order= await getNewOrderForCurrentUser(req);
    if(order) res.send(order);
    else res.status(HTTP_BAD_REQUEST).send();
}))

router.post('/pay', asyncHander( async (req:any, res) => {
    const {paymentId} = req.body;
    const order = await getNewOrderForCurrentUser(req);
    if(!order){
        res.status(HTTP_BAD_REQUEST).send('Order Not Found!');
        return;
    }

    order.paymentId = paymentId;
    order.status = OrderStatus.PAYED;
    order.ordertags = OrderStatus.PAYED;
    await order.save();

    res.send(order._id);
}))

router.get('/track/:id', asyncHander( async (req, res) =>{
    const order = await OrderModel.findById(req.params.id);
    res.send(order);
}))

router.get("/get", asyncHander(
    async (req:any, res:any) => {
        const orders = await OrderModel.find()
        res.send(orders);
    }
))

router.get("/ordertags", asyncHander(
    async (req, res) => {
        const ordertags = await OrderModel.aggregate([
            {
                $unwind:'$ordertags'
            },
            {
                $group:{
                    _id: '$ordertags',
                    count: {$sum: 1}
                }
            },
            {
                $project:{
                    _id: 0,
                    name:'$_id',
                    count: '$count'
                }
            }
        ]).sort({count: -1});

        const all = {
            name: 'All',
            count: await OrderModel.countDocuments()
        }
        
        ordertags.unshift(all);
        res.send(ordertags);
    }
))

router.get("/ordertag/:tagName", asyncHander(
    async (req, res) => {
        const orders = await OrderModel.find({ status: req.params.tagName })
        res.send(orders);
    }
))

router.put('/updateStatus/:orderId', async (req, res) => {
    const { orderId } = req.params;
    try {
      const updatedOrder = await OrderModel.findByIdAndUpdate(orderId, req.body, { new: true });
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Food not found' });
      }
      res.send(updatedOrder);
    } catch (error) {
      console.error('Error updating food details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

router.get("/",asyncHander(
    async (req:any, res:any) => {
        const foods = await OrderModel.find({ user: req.user.id });
        res.send(foods);
    }
))

export default router;

async function getNewOrderForCurrentUser(req: any) {
    return await OrderModel.findOne({ user: req.user.id, status: OrderStatus.NEW });
}