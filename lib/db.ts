import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL!;

if (!MONGODB_URL) {
  throw new Error("Check database connection error.");
}

//check if there is a connection already or attempt to make
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDB() {
  //if connection already return it
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const options = {
      bufferCommands: true,
      maxPoolSize: 10,
    };
    //else create a connection to db 
    cached.promise = mongoose
      .connect(MONGODB_URL, options)
      .then((m) => m.connection);
  }
  //resolve the promise, get the connection to cached 
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
  }
  //lastly return it.
  return cached.conn;
}
