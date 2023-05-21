const Stripe = require('stripe');
const path = require('path');
const stripe = Stripe('sk_test_51N5RPgSEtJHgTVOH5639Ehi1wTX5knJkW6po1m955ysK9KFALxMPmcNrvSppqM5Nn06tGAtdWmH0BtdDyA8vX8wv00EvpOatcZ');
// const YOUR_DOMAIN = "http://localhost"

exports.createPayment = async(req,res)=>{
    try{
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            // shipping_address_collection: {
            //   allowed_countries: ["US", "CA", "KE","IND"],
            // },
            
            phone_number_collection: {
              enabled: true,
            },
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: "url shortner",
                            // images: [product.image],
                        },
                        unit_amount:  100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            // customer: "123",
            success_url: `http://localhost:3000`,
            cancel_url: `http://localhost:3000`,
          });
        
        console.log(session)
    
        const sessionId = session.id;
        const url = session.url;
        res.redirect(url);
    }
    catch(err){
        console.log(err);
        // throw err;
        res.json({err})

    }
}