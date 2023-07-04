import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const uri =
    "mongodb+srv://muntasirulmsd:muntasirulmsd@cluster0.kytmhhe.mongodb.net/";

  const client = new MongoClient(uri);

  try {
    const database = client.db("munna");
    const movies = database.collection("inventory");

    // Query for a movie that has the title 'Back to the Future'
    const query = {};
    // const movie = await movies.find(query).toArray;

    // console.log(movie);
    return NextResponse.json({ a: 34 });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
