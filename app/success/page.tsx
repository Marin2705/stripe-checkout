import Link from "next/link";

export default function Success() {
  return (
    <div className="ml-4 mt-4">
      <h1 className="text-4xl font-bold mb-8">Success</h1>
      <p className="mb-4">Your payment was successful!</p>
      <Link
        href="/"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 w-full"
      >
        Back to products
      </Link>
    </div>
  );
}
