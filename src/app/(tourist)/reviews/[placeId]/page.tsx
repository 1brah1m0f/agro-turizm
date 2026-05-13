export default function ReviewsPage({ params }: { params: { placeId: string } }) {
  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold text-text-dark mb-2">Rəylər</h1>
      <p className="text-muted">Məkan: {params.placeId}</p>
    </div>
  );
}
