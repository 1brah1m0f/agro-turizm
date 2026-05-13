export default async function EditPlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold text-text-dark mb-2">Məkanı Redaktə Et</h1>
      <p className="text-muted">ID: {id}</p>
    </div>
  );
}
