import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { redirect } from "next/navigation";

export default async function Home() {
  // API documentation: https://stripe.com/docs/api/products/list
  const products = await stripe.products.list({
    expand: ["data.default_price"], // Expand the default_price object to get the price of the product
  });

  async function buy(priceId: string) {
    "use server"; // DO NOT FORGET THIS LINE!
    // Learn more about 'server' actions here: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    redirect(session.url!);
  }

  // To learn more about the expand parameter, see: https://stripe.com/docs/api/expanding_objects

  return (
    <div className="ml-4 mt-4">
      <h1 className="text-4xl font-bold mb-8">Products</h1>
      <ul className="flex flex-col space-y-4">
        {products.data.map((product) => {
          const buyAction = buy.bind(
            null,
            (product.default_price as Stripe.Price).id
          );

          // Learn more about binding actions technic here : https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#passing-additional-arguments

          return (
            <li key={product.id} className="p-4 border rounded-xl w-1/4">
              <form action={buyAction}>
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <p>
                  {(
                    (product.default_price as Stripe.Price).unit_amount! / 100
                  ).toFixed(2)}
                  €
                </p>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 w-full"
                >
                  Buy
                </button>
              </form>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
