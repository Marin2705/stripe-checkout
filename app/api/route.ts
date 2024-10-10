import Cors from "micro-cors";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

const secret =
  process.env.STRIPE_WEBHOOK_SECRET ||
  "whsec_5333186d983533204b5a975b7cf2cd23351b7e9206c0a374ccad35a1e7514bd6";

export async function POST(req: Request) {
  try {
    const body = await req.text();

    const signature = headers().get("stripe-signature");

    const event = stripe.webhooks.constructEvent(body, signature, secret);

    if (event.type === "payment_intent.succeeded") {
      console.log("--------> payment_intent.succeeded");
    }

    return NextResponse.json({ result: event, ok: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "something went wrong",
        ok: false,
      },
      { status: 500 }
    );
  }
}

// const event = request.body;

// // Handle the event
// switch (event.type) {
//   case 'payment_intent.succeeded':
//     const paymentIntent = event.data.object;
//     // Then define and call a method to handle the successful payment intent.
//     // handlePaymentIntentSucceeded(paymentIntent);
//     break;
//   case 'payment_method.attached':
//     const paymentMethod = event.data.object;
//     // Then define and call a method to handle the successful attachment of a PaymentMethod.
//     // handlePaymentMethodAttached(paymentMethod);
//     break;
//   // ... handle other event types
//   default:
//     console.log(`Unhandled event type ${event.type}`);
// }

// // Return a response to acknowledge receipt of the event
// response.json({received: true});
