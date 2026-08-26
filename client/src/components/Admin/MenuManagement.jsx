import { useState, useEffect } from 'react';
import { getAllMenuItems, deleteMenuItem, updateMenuItem } from '../../services/menuService';
import { getCategories } from '../../services/categoryService';
import AddMenuItemModal from './AddMenuItemModal';
import EditMenuItemModal from './EditMenuItemModal';
import { seedMenuDatabase } from '../../utils/seedData';
import { formatPrice } from '../../utils/priceFormatter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Database, 
  Search, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  UtensilsCrossed, 
  Sparkles 
} from 'lucide-react';

const MenuManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const [data, catData] = await Promise.all([
        getAllMenuItems(),
        getCategories()
      ]);
      setItems(data);
      setCategories(catData.filter(c => c.isActive).map(c => c.name));
    } catch (error) {
      console.error("Error fetching menu items:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmItem) return;
    try {
      await deleteMenuItem(deleteConfirmItem.id);
      setItems(items.filter(item => item.id !== deleteConfirmItem.id));
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setDeleteConfirmItem(null);
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      await updateMenuItem(item.id, { available: !item.available });
      setItems(items.map(i => i.id === item.id ? { ...i, available: !item.available } : i));
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleSeed = async () => {
    if (window.confirm("Are you sure you want to seed the database? This will add all predefined items.")) {
      setIsSeeding(true);
      const result = await seedMenuDatabase();
      setIsSeeding(false);
      if (result.success) {
        alert("Database seeded successfully!");
        fetchItems();
      } else {
        alert("Failed to seed database.");
      }
    }
  };

  const filteredItems = items.filter(item => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        item.name?.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term) ||
        item.category?.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight font-sans m-0">Menu Catalog</h2>
          <p className="text-xs text-neutral-400 m-0">Manage restaurant menu items, pricing, and availability</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSeed}
            disabled={isSeeding}
            className="text-xs"
          >
            <Database className="w-3.5 h-3.5 mr-1.5" />
            {isSeeding ? 'Seeding...' : 'Seed Database'}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="text-xs font-semibold"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Item
          </Button>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-neutral-400" />
          <Input
            className="pl-10"
            placeholder="Search items by name, description, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          className="w-full md:w-64"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </Select>
      </div>

      {/* Menu Items Table */}
      {loading ? (
        <div className="py-12 text-center text-neutral-400">Loading menu catalog...</div>
      ) : filteredItems.length === 0 ? (
        <div className="py-12 text-center text-neutral-400 border border-dashed border-neutral-800 rounded-xl bg-neutral-900/40">
          <UtensilsCrossed className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-neutral-200 m-0">No menu items found</h3>
          <p className="text-xs text-neutral-500 mt-1 m-0">Try clearing filters or adding a new menu item.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/90 overflow-hidden shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Item</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Available</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    <img
                      src={item.image || 'https://placehold.co/50/1B1B1B/FFFFFF?text=Ala+Turqa'}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover border border-neutral-800"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-neutral-100">{item.name}</div>
                    <div className="text-xs text-neutral-400 line-clamp-1">{item.description}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize text-xs font-normal">
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono font-bold text-gold">
                    {formatPrice(item.price, item.displayPrice)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={item.available ? "outline" : "ghost"}
                      size="sm"
                      onClick={() => handleToggleAvailability(item)}
                      className={`h-7 px-2 text-xs ${
                        item.available ? 'border-emerald-800/60 text-emerald-400 bg-emerald-950/30' : 'text-red-400 bg-red-950/30'
                      }`}
                    >
                      {item.available ? <Check className="w-3.5 h-3.5 mr-1" /> : <X className="w-3.5 h-3.5 mr-1" />}
                      {item.available ? 'Available' : 'Unavailable'}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditModal(item)}
                      className="h-8 w-8 text-neutral-300 hover:text-white hover:bg-neutral-800"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteConfirmItem(item)}
                      className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-950/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {showAddModal && (
        <AddMenuItemModal
          categories={categories}
          onClose={() => setShowAddModal(false)}
          onAdd={(newItem) => {
            setItems([newItem, ...items]);
            setShowAddModal(false);
          }}
        />
      )}

      {showEditModal && selectedItem && (
        <EditMenuItemModal
          categories={categories}
          item={selectedItem}
          onClose={() => setShowEditModal(false)}
          onUpdate={(updatedItem) => {
            setItems(items.map(i => i.id === updatedItem.id ? updatedItem : i));
            setShowEditModal(false);
          }}
        />
      )}

      <AlertDialog
        open={!!deleteConfirmItem}
        onOpenChange={(open) => !open && setDeleteConfirmItem(null)}
        title="Delete Menu Item?"
        description={`Are you sure you want to permanently delete "${deleteConfirmItem?.name}"? You can also set its availability to false instead to retain sales history.`}
        confirmText="Delete Permanently"
        cancelText="Cancel"
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default MenuManagement;
