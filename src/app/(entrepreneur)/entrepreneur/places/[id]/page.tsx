export default function EditPlacePage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold text-text-dark mb-2">Məkanı Redaktə Et</h1>
      <p className="text-muted">ID: {params.id}</p>
    </div>
  );
}
