export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-16 container mx-auto px-4 max-w-3xl prose dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <p>
        Jogira Treks respects your privacy. We collect personal information only
        to process bookings and improve our services. We do not sell your data to
        third parties.
      </p>
      <h2>Information We Collect</h2>
      <p>Name, email, phone number, and address when you book a trek or contact us.</p>
      <h2>How We Use Your Data</h2>
      <p>
        To confirm bookings, send trek updates, process payments, and respond to
        inquiries.
      </p>
      <h2>Contact</h2>
      <p>For privacy concerns, email hello@jogira.com</p>
    </div>
  );
}
