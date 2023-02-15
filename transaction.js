require("dotenv").config();
const { MongoClient } = require("mongodb");
const { createReservation } = require("./helper");

async function main() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();

    await createReservation(
      client,
      "tom@me.com",
      "Infinite Views",
      [new Date("2021-11-31"), new Date("2022-01-11")],
      {
        pricePerNight: 230,
        specialRequest: "Late Cehckout",
        breakfastIncuded: true,
      }
    );
  } finally {
    // TODO: MongoExpiredSessionError: Cannot use a session that has ended
    await client.close();
  }
}

main().catch(console.error);
