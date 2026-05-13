export default function PlaceActivitiesPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold text-text-dark mb-2">Fəaliyyətlər</h1>
      <p className="text-muted">Məkan: {params.id}</p>
    </div>
  );
}
