// /components/categories/SubcategoryList.js
import { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import SubcategoryForm from './SubcategoryForm';

const SubcategoryList = ({ category, onClose }) => {
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSub, setSelectedSub] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setSubcategories([
      { id: 1, name: 'Tiles' },
      { id: 2, name: 'Marble' },
    ]);
  }, [category]);

  const handleDelete = (id) => {
    setSubcategories(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="mt-4">
      <h5>Subcategories of {category.name}</h5>
      <Button onClick={() => { setSelectedSub(null); setShowForm(true); }}>+ Add Subcategory</Button>
      {showForm && (
        <SubcategoryForm
          initialData={selectedSub}
          onSave={(data) => {
            if (selectedSub) {
              setSubcategories(prev => prev.map(s => (s.id === data.id ? data : s)));
            } else {
              setSubcategories(prev => [...prev, { ...data, id: Date.now() }]);
            }
            setShowForm(false);
          }}
          onClose={() => setShowForm(false)}
        />
      )}
      <Table bordered className="mt-2">
        <thead>
          <tr>
            <th>Subcategory</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subcategories.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>
                <Button size="sm" onClick={() => { setSelectedSub(s); setShowForm(true); }}>Edit</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDelete(s.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="outline-secondary" onClick={onClose}>Back to Categories</Button>
    </div>
  );
};

export default SubcategoryList;