export default async function BookingConfirmationPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params;
  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold text-text-dark mb-2">Bron Təsdiqləndi</h1>
      <p className="text-muted">Bron ID: {bookingId}</p>
    </div>
  );
}
