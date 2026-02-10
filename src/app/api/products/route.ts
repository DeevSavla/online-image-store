import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/db";
import Product, { IProduct } from "../../../../models/product.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectToDB();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();

    const filter = search
      ? { name: { $regex: `^${escapeRegex(search)}`, $options: "i" } }
      : {};
    const products = await Product.find(filter).lean();
    return NextResponse.json({ products: products ?? [] }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong fetching products" },
      { status: 500 }
    );
  }
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectToDB();
    const body: IProduct = await request.json();
    if (
      !body.name ||
      !body.description ||
      !body.imageUrl ||
      body.variants.length === 0
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const newProduct = await Product.create(body);
    return NextResponse.json({ newProduct }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong creating product" },
      { status: 500 }
    );
  }
}
