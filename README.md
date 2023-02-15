# transaction-in-mongodb

<code> node transaction.js </code> ile transaction'i baslatabilirsiniz.

✅ Ornek Success ciktisi asagidaki gibidir. 

```shell
{
  1 document(s) found in the users collection with the email address tom@me.com.
  1 document(s) was/were updated to include to reservation.
  0 document(s) found in the listingsAndReviews collection with the name Infinite Views.
  0 document(s) was/were updated to include to reservation dates.
  The reservation was successfully created.
}
```

⛔️ Ornek Abort edilmis transaction ciktisi asagidaki gibidir. 

```shell
{
  1 document(s) found in the users collection with the email address tom@me.com.
  1 document(s) was/were updated to include to reservation.
  This listing already reserved for at least one of the given dates. The reservation could not be created.
  Any operations that already occurred as part of this transaction will be rolled back.
  The reservation was intentionally aborted.
}
```

