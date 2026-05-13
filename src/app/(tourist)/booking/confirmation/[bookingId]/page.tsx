export default function BookingConfirmationPage({ params }: { params: { bookingId: string } }) {
  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold text-text-dark mb-2">Bron Təsdiqləndi</h1>
      <p className="text-muted">Bron ID: {params.bookingId}</p>
    </div>
  );
}
