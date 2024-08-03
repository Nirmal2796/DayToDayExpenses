
const Razorpay = require('razorpay');
const Order = require('../models/order');
const userController=require('./user');

exports.purchasePremium = async (req, res) => {
    try {

        const rzp = new Razorpay({
            key_id: 'rzp_test_BPtSSVp3iZJOGc',
            key_secret: 'xsOrQNuNCey0eBphz7e4XREA'
        });

        const amount = 2500;

        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            if (err) {
                throw new Error(err);
            }
            else {
                userOrder = {
                    orderid: order.id,
                    status: 'PENDING'
                };

                console.log(userOrder);
                await req.user.createOrder(userOrder)

                return res.status(201).json({ order, key_id: rzp.key_id });

            }
        })
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong' });

    }
}


exports.updateTransaction = async (req, res) => {

    try {

        const { order_id, payment_id,status } = req.body;

        console.log(order_id, 'paymentid ',payment_id, 'status',status);
        const order =await Order.findOne({ where: { orderid: order_id } });
        // console.log(order);
        let update1 ;
        let update2 ;
        if(status=='successful'){
            update1=order.update({ paymentid: payment_id, status: 'SUCCESSFUL' });
            update2=req.user.update({ ispremiumuser: true });
            
        }
        else{
            update1 = order.update({ payment_id: payment_id, status: 'FAILED' });
            update2 = req.user.update({ ispremiumuser: false });           
        }

        await Promise.all([update1, update2]);
        res.status(202).json({ success: true, message: status , token: userController.generateToken(req.user.id,req.user.ispremiumuser)});

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Something went wrong' });

    }

}