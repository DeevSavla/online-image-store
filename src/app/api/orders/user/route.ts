import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import { NextResponse } from "next/server";
import { connectToDB } from "../../../../../lib/db";
import Order from "../../../../../models/order.model";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    const orders = await Order.find({ userId: session.user.id })
      //instead of giving entire productId object ref, provides only _id, imageUrl and name of the product.
      .populate({
        path: "productId",
        select: "imageUrl name",
        options: { strictPopulate: false },
      })
      .sort({ createdAt: -1 })
      .lean();

    const validOrders = orders.map((order) => ({
      ...order,
      productId: order.productId || {
        imageUrl: null,
        name: "Product no longer available",
      },
    }));

    return NextResponse.json(validOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
