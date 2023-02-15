const { MongoClient } = require("mongodb");
const createReservation = require("./helper");

async function main() {
  const uri = "URI";
  const client = new MongoClient(uri);

  try {
    await client.connect();

    await createReservation(
      client,
      "resatyavcin@me.com",
      "Infinite Views",
      [new Date("2021-12-31"), new Date("2022-01-01")],
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
