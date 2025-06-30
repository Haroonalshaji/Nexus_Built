// /components/categories/CategoryForm.js
import { useForm } from 'react-hook-form';
import { Button, Form } from 'react-bootstrap';

const CategoryForm = ({ initialData, onSave, onClose }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: { name: initialData?.name || '' },
  });

  const onSubmit = (data) => {
    const payload = { ...initialData, ...data };
    onSave(payload);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="my-3">
      <Form.Group>
        <Form.Label>Category Name</Form.Label>
        <Form.Control {...register('name')} placeholder="e.g., Flooring" required />
      </Form.Group>
      <div className="mt-2">
        <Button type="submit">{initialData ? 'Update' : 'Create'}</Button>{' '}
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
      </div>
    </Form>
  );
};

export default CategoryForm;