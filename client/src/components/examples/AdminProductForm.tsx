import AdminProductForm from '../AdminProductForm';

export default function AdminProductFormExample() {
  return (
    <div className="p-8 max-w-2xl">
      <AdminProductForm
        onSubmit={(data) => console.log('Product submitted:', data)}
        onCancel={() => console.log('Cancelled')}
      />
    </div>
  );
}
