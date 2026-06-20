'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuApi } from '@/services/api';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import type { MenuItem, Category } from '@/types';
import clsx from 'clsx';

export default function DashboardMenuPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<'items' | 'categories'>('items');
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
  const [editingCat, setEditingCat] = useState<Partial<Category> | null>(null);

  const { data: items = [], isLoading: loadingItems } = useQuery({
    queryKey: ['menu-items'],
    queryFn: menuApi.listItems,
  });
  const { data: categories = [], isLoading: loadingCats } = useQuery({
    queryKey: ['categories'],
    queryFn: menuApi.listCategories,
  });

  const deleteItem = useMutation({
    mutationFn: menuApi.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      toast.success('Item deleted');
    },
  });

  const saveMutation = useMutation({
    mutationFn: (item: Partial<MenuItem>) =>
      item.id ? menuApi.updateItem(item.id, item) : menuApi.createItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      setEditingItem(null);
      toast.success('Saved');
    },
    onError: () => toast.error('Failed to save'),
  });

  const saveCatMutation = useMutation({
    mutationFn: (cat: Partial<Category>) =>
      cat.id ? menuApi.updateCategory(cat.id, cat) : menuApi.createCategory(cat),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditingCat(null);
      toast.success('Saved');
    },
  });

  const deleteCat = useMutation({
    mutationFn: menuApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted');
    },
  });

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-bold">Menu Management</h1>
          <button
            onClick={() =>
              tab === 'items'
                ? setEditingItem({ name: '', price: '0', description: '', is_available: true })
                : setEditingCat({ name: '', is_active: true })
            }
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add {tab === 'items' ? 'Item' : 'Category'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['items', 'categories'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                'px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all',
                tab === t
                  ? 'bg-brand-500 text-white'
                  : 'bg-surface-raised text-neutral-400 hover:text-white'
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Item Form Modal */}
        {editingItem && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="card p-6 w-full max-w-md space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white">
                  {editingItem.id ? 'Edit Item' : 'New Item'}
                </h2>
                <button onClick={() => setEditingItem(null)} className="btn-ghost p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <input
                className="input"
                placeholder="Name"
                value={editingItem.name || ''}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
              />
              <textarea
                className="input resize-none"
                rows={2}
                placeholder="Description"
                value={editingItem.description || ''}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="input"
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={editingItem.price || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                />
                <select
                  className="input"
                  value={editingItem.category || ''}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, category: Number(e.target.value) })
                  }
                >
                  <option value="">Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={editingItem.is_available ?? true}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, is_available: e.target.checked })
                  }
                />
                Available
              </label>
              <button
                onClick={() => saveMutation.mutate(editingItem)}
                disabled={saveMutation.isPending}
                className="btn-primary w-full"
              >
                {saveMutation.isPending ? 'Saving…' : 'Save Item'}
              </button>
            </div>
          </div>
        )}

        {/* Category Form Modal */}
        {editingCat && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="card p-6 w-full max-w-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white">
                  {editingCat.id ? 'Edit Category' : 'New Category'}
                </h2>
                <button onClick={() => setEditingCat(null)} className="btn-ghost p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <input
                className="input"
                placeholder="Category name"
                value={editingCat.name || ''}
                onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
              />
              <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingCat.is_active ?? true}
                  onChange={(e) =>
                    setEditingCat({ ...editingCat, is_active: e.target.checked })
                  }
                />
                Active
              </label>
              <button
                onClick={() => saveCatMutation.mutate(editingCat)}
                disabled={saveCatMutation.isPending}
                className="btn-primary w-full"
              >
                {saveCatMutation.isPending ? 'Saving…' : 'Save Category'}
              </button>
            </div>
          </div>
        )}

        {/* Items List */}
        {tab === 'items' && (
          loadingItems ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="card h-16 animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="card p-4 flex items-center gap-4 hover:border-brand-500/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-sm text-neutral-500">{item.category_name}</p>
                  </div>
                  <span className="text-brand-400 font-semibold">
                    ${parseFloat(item.price).toFixed(2)}
                  </span>
                  <span className={clsx('badge text-xs', item.is_available
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-neutral-500/10 text-neutral-400')}>
                    {item.is_available ? 'Available' : 'Unavailable'}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="btn-ghost p-2 text-neutral-400 hover:text-brand-400"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteItem.mutate(item.id)}
                      className="btn-ghost p-2 text-neutral-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <p className="text-center py-12 text-neutral-500">
                  No menu items yet. Add one above.
                </p>
              )}
            </div>
          )
        )}

        {/* Categories List */}
        {tab === 'categories' && (
          loadingCats ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="card h-16 animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="card p-4 flex items-center gap-4 hover:border-brand-500/30 transition-colors"
                >
                  <p className="flex-1 font-medium text-white">{cat.name}</p>
                  <span className={clsx('badge text-xs', cat.is_active
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-neutral-500/10 text-neutral-400')}>
                    {cat.is_active ? 'Active' : 'Hidden'}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingCat(cat)}
                      className="btn-ghost p-2 text-neutral-400 hover:text-brand-400"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteCat.mutate(cat.id)}
                      className="btn-ghost p-2 text-neutral-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {categories.length === 0 && (
                <p className="text-center py-12 text-neutral-500">
                  No categories yet. Add one above.
                </p>
              )}
            </div>
          )
        )}
      </main>
    </div>
  );
}
