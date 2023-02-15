function createReservationDocument(
  nameOfListing,
  reservationDates,
  reservationDetails
) {
  let reservation = {
    name: nameOfListing,
    dates: reservationDates,
  };

  for (const detail in reservationDetails) {
    reservation[detail] = reservationDetails[detail];
  }

  return reservation;
}

async function createReservation(
  client,
  userEmail,
  nameOfListing,
  reservationDates,
  reservationDetails
) {
  const usersCollection = client.db("sample_airbnb").collection("users");
  const listingsAndReviewsCollection = client
    .db("sample_airbnb")
    .collection("listingsAndReviews");

  const reservation = createReservationDocument(
    nameOfListing,
    reservationDates,
    reservationDetails
  );

  const session = client.startSession();
  const transactionOption = {
    readPreference: "primary",
    readConcern: { level: "local" },
    writeConcern: { w: "majority" },
  };

  try {
    const transactionResults = session.withTransaction(async () => {
      const usersUpdatesResults = await usersCollection.updateOne(
        {
          email: userEmail,
        },
        { $addToSet: { reservations: reservation } },
        session
      );

      console.log(
        `${usersUpdatesResults.matchedCount} document(s) found in the users collection with the email address ${userEmail}.`
      );
      console.log(
        `${usersUpdatesResults.matchedCount} document(s) was/were updated to include to reservation.`
      );

      const isListingReservedResults =
        await listingsAndReviewsCollection.findOne(
          {
            name: nameOfListing,
            datesReserved: { $in: reservationDates },
          },
          { session }
        );

      if (isListingReservedResults) {
        await session.abortTransaction();

        console.error(
          "This listing already reserved for at least one of the given dates. The reservation could not be created."
        );
        console.error(
          "Any operations that already occurred as part of this transaction will be rolled back."
        );
        return;
      }

      const listingsAndReviewsUpdateResults =
        await listingsAndReviewsCollection.updateOne(
          { name: nameOfListing },
          { $addToSet: { datesReserved: { $each: reservationDates } } },
          { session }
        );

      console.log(
        `${listingsAndReviewsUpdateResults.matchedCount} document(s) found in the listingsAndReviews collection with the name ${nameOfListing}.`
      );
      console.log(
        `${listingsAndReviewsUpdateResults.modifiedCount} document(s) was/were updated to include to reservation dates.`
      );
    }, transactionOption);

    if (transactionResults) {
      console.log("The reservation was successfully created.");
    } else {
      console.log("The reservation was intentionally aborted.");
    }
  } catch (e) {
    console.log("The transaction was aborted due to anunexpected error:  " + e);
  } finally {
    await session.endSession();
  }
}

module.exports = createReservation;
