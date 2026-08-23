import { useEffect, useState } from 'react';
import {
  createCategory,
  deleteCategorySafely,
  getCategories,
  updateCategory,
} from '../../services/categoryService';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed loading categories:', err);
      setError('Unable to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!newCategory.trim()) return;
    try {
      await createCategory({ name: newCategory.trim(), sortOrder: categories.length });
      setNewCategory('');
      await load();
    } catch (err) {
      setError(err.message || 'Failed to create category.');
    }
  };

  const handleToggle = async (category) => {
    if (category.derived) return;
    try {
      await updateCategory(category.id, { isActive: !category.isActive });
      await load();
    } catch (err) {
      setError(err.message || 'Failed to update category.');
    }
  };

  const handleDelete = async (category) => {
    if (category.derived) return;
    if (!window.confirm(`Delete ${category.name}?`)) return;
    try {
      await deleteCategorySafely(category.name);
      await updateCategory(category.id, { isActive: false });
      await load();
    } catch (err) {
      setError(err.message || 'Unable to delete category.');
    }
  };

  if (loading) return <div className="text-light">Loading categories...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="text-light">
      <div className="card border-0 mb-3" style={{ backgroundColor: '#1B1B1B' }}>
        <div className="card-body">
          <form className="d-flex gap-2" onSubmit={handleCreate}>
            <input
              className="form-control bg-dark text-light border-secondary"
              placeholder="New category name"
              value={newCategory}
              onChange={(event) => setNewCategory(event.target.value)}
            />
            <button className="btn btn-gold" type="submit">Add Category</button>
          </form>
        </div>
      </div>

      <div className="card border-0" style={{ backgroundColor: '#1B1B1B' }}>
        <div className="card-body p-0">
          {categories.length === 0 ? (
            <div className="p-4 text-muted">No categories found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark mb-0 align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Source</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>{category.isActive ? 'Active' : 'Inactive'}</td>
                      <td>{category.derived ? 'Derived' : 'Collection'}</td>
                      <td className="text-end">
                        {!category.derived && (
                          <>
                            <button className="btn btn-sm btn-outline-light me-2" onClick={() => handleToggle(category)}>
                              {category.isActive ? 'Disable' : 'Enable'}
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(category)}>
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
