export default function TermsPage() {
  return (
    <div className="pt-24 pb-16 container mx-auto px-4 max-w-3xl prose dark:prose-invert">
      <h1>Terms & Conditions</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <h2>Booking Terms</h2>
      <p>
        All bookings are subject to availability. Full payment is required to
        confirm your spot.
      </p>
      <h2>Cancellation Policy</h2>
      <ul>
        <li>7+ days before trek: Full refund</li>
        <li>3-6 days before: 50% refund</li>
        <li>Less than 3 days: No refund</li>
      </ul>
      <h2>Safety</h2>
      <p>
        Participants must follow trek leader instructions. Jogira Treks is not
        liable for injuries caused by negligence of participants.
      </p>
    </div>
  );
}
