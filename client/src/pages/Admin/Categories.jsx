import { useEffect, useState } from 'react';
import {
  createCategory,
  deleteCategorySafely,
  getCategories,
  updateCategory,
} from '../../services/categoryService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Plus, FolderKanban, Trash2, Power } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [deleteConfirmCat, setDeleteConfirmCat] = useState(null);

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

  const confirmDeleteCategory = async () => {
    if (!deleteConfirmCat || deleteConfirmCat.derived) return;
    try {
      await deleteCategorySafely(deleteConfirmCat.name);
      await updateCategory(deleteConfirmCat.id, { isActive: false });
      await load();
    } catch (err) {
      setError(err.message || 'Unable to delete category.');
    } finally {
      setDeleteConfirmCat(null);
    }
  };

  if (loading) return <div className="py-12 text-center text-neutral-400">Loading categories...</div>;
  if (error) return <div className="p-4 rounded-xl border border-red-800 bg-red-950/40 text-red-400">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Create Category Form */}
      <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
        <form className="flex gap-3" onSubmit={handleCreate}>
          <Input
            placeholder="New category name (e.g. Desserts, Beverages)..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="default" size="default" className="shrink-0 font-semibold">
            <Plus className="w-4 h-4 mr-1" /> Add Category
          </Button>
        </form>
      </div>

      {/* Categories Table */}
      {categories.length === 0 ? (
        <div className="py-12 text-center text-neutral-400 border border-dashed border-neutral-800 rounded-xl bg-neutral-900/40">
          <FolderKanban className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-neutral-200 m-0">No categories found</h3>
          <p className="text-xs text-neutral-500 mt-1 m-0">Create your first menu category above.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/90 overflow-hidden shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-semibold text-neutral-100">{category.name}</TableCell>
                  <TableCell>
                    <Badge variant={category.isActive ? "success" : "secondary"}>
                      {category.isActive ? 'Active' : 'Disabled'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs text-neutral-400 border-neutral-800 font-normal">
                      {category.derived ? 'System Derived' : 'Custom Collection'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {!category.derived && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggle(category)}
                          className="h-8 text-xs"
                        >
                          <Power className="w-3.5 h-3.5 mr-1" />
                          {category.isActive ? 'Disable' : 'Enable'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirmCat(category)}
                          className="h-8 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog
        open={!!deleteConfirmCat}
        onOpenChange={(open) => !open && setDeleteConfirmCat(null)}
        title="Delete Category?"
        description={`Are you sure you want to delete "${deleteConfirmCat?.name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteCategory}
      />
    </div>
  );
};

export default Categories;
