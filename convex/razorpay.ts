'use node'
import { ConvexError, v } from "convex/values";
import { ActionCtx, action, internalAction } from "./_generated/server";
import Razorpay from 'razorpay'
import { internal } from "./_generated/api";
import crypto from 'crypto'

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_ID as string
  , // YOUR RAZORPAY KEY
  key_secret:process.env.RAZORPAY_KEY as string // YOUR RAZORPAY SECRET
});

export const order = action({
    args: {total:v.number()},
    handler: async({runMutation}, {total}) => {
        try {
            console.log({total});
            
                
                console.log({instance});
                
                const options = {
                  amount: Number(total) *100 ,
                  currency: 'INR',
                  receipt: 'receipt_order_74394',
                };
            
                const order = await instance.orders.create(options);
                console.log(order)
                if (!order) throw new ConvexError('something went wrong with razorpay');
            
                return order
              } catch (error) {
                console.log(error);
                
                throw new ConvexError('something went wrong with razorpay');
              }
    },
})

export const success = action({
    args:{
        userId: v.id('users'),
orderCreationId: v.string(),
razorpayPaymentId: v.string(),
razorpayOrderId:v.string(),
razorpaySignature: v.string(),
amount: v.number()
},
handler: async ({runMutation},{userId,orderCreationId,razorpayOrderId,razorpayPaymentId,razorpaySignature,amount}) => {
    const shasum = crypto.createHmac('sha256', 'rzp_test_YFLLlUpjAUZj9a');
    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
    const digest = shasum.digest('hex');

    // console.log({digest},{razorpaySignature});
    
    // if(digest !== razorpaySignature){
    //     throw new ConvexError('Transaction is not legal')
    // }

    try {
        await runMutation(internal.payments.create,{
            userId,
            orderId:razorpayOrderId,
            razorpayId: razorpayPaymentId,
            signature: razorpaySignature,
            success:true,
            amount:amount
        })

        return {
                  msg: 'success',

                }

    }catch(err){
        throw new ConvexError('Transaction is not legal')
    }
}
})

// refound process
export const refund = internalAction({
  args: {orderId:v.id('orders'),orgId: v.string()},
  handler: async(ctx:ActionCtx,args) => {
      try {
          console.log(args?.orderId);
          
              
              console.log({instance});
              const access = await ctx?.runQuery(internal?.payments?.hasAccessForRazorPay,{orderId:args?.orderId,orgId:args?.orgId})

        if(!access){
            throw new ConvexError('no access to order')
        }
        console.log(access?.order)
        if (!order) throw new ConvexError('something went wrong with razorpay');
        
        const payments = await ctx?.runQuery(internal.payments.paymentsQuery,{orderId:args?.orderId})
        
        if(!payments) throw new ConvexError('payment is not exist ')
        
        // Perform the refund with Razorpay
        const options = {
          amount: Number(payments?.amount) *100 ,
          currency: 'INR',
          receipt: 'receipt_order_74394',
        };
    
        const refundResponse = await instance.payments.refund(payments?.razorpayId, options);

        if(refundResponse?.status === 'processed'){
          
          await ctx.runMutation(internal?.payments?.paymentsAndOrderMutation,{orderId: args?.orderId, paymentId: payments?._id})

          return {
            success: true,
            message: 'Refund went for proccesing successfully'
          }
        } else {
          throw new ConvexError('Refound procceing failed')
        }
          
            } catch (error) {
              console.log(error);
              
              throw new ConvexError('something went wrong with razorpay');
            }
  },
})
