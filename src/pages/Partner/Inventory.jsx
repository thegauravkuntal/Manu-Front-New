import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaBox, FaEdit, FaTrashAlt, FaCheckCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { API_BASE_URL } from '../../api/config';

const emptyForm = {
  name: '',
  category: '',
  sku: '',
  stock: 0,
  price: '',
  description: ''
};

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [fetchError, setFetchError] = useState('');

  const fetchInventory = async () => {
    try {
      setFetchError('');
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/partner/inventory`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok) {
        const list = Array.isArray(data) ? data : data.inventory || [];
        setItems(list);
      } else {
        setItems([]);
        setFetchError(data.msg || 'Could not load inventory');
      }
    } catch (err) {
      console.error("Fetch inventory error:", err);
      setFetchError('Network error loading inventory');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const openAddModal = () => {
    setIsEditMode(false);
    setEditingItemId(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingItemId(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = isEditMode
        ? `${API_BASE_URL}/partner/inventory/${editingItemId}`
        : `${API_BASE_URL}/partner/inventory`;

      const payload = {
        ...formData,
        stock: Math.max(0, Number(formData.stock) || 0),
      };

      const res = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && (data.success !== false)) {
        closeModal();
        fetchInventory();
      } else {
        alert(data.msg || "Operation failed");
      }
    } catch (err) {
      console.error("Inventory error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      category: item.category,
      sku: item.sku,
      stock: item.stock ?? 0,
      price: item.price,
      description: item.description || ''
    });
    setEditingItemId(item._id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/partner/inventory/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        fetchInventory();
      } else {
        alert(data.msg || "Failed to delete item");
      }
    } catch (err) {
      console.error("Delete inventory error:", err);
      alert("Could not delete item");
    }
  };

  const getStockStatus = (item) => {
    const stock = Number(item.stock) || 0;
    if (stock === 0) return { label: 'Out of Stock', className: 'text-red-600' };
    if (stock <= 5) return { label: 'Low Stock', className: 'text-orange-600' };
    return { label: 'In Stock', className: 'text-orange-500' };
  };

  const filteredItems = items.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Inventory Management</h1>
          <p className="text-slate-500 text-sm">
            Manage your machinery stock, SKUs, and listing prices.
            {items.length > 0 && (
              <span className="ml-1 font-semibold text-[#1E3A8A]">({items.length} items)</span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="bg-[#1E3A8A] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#1E40AF] transition-all flex items-center gap-2"
        >
          <FaPlus /> Add New Item
        </button>
      </div>

      {fetchError && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
          {fetchError}
        </div>
      )}

      <div className="relative w-full md:w-96">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, SKU, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-600 transition-all text-sm"
        />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400 text-2xl">
              <FaBox />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              {items.length === 0 ? 'No inventory yet' : 'No matching items'}
            </h3>
            <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
              {items.length === 0
                ? 'Add machines you sell so you can track stock and prices in one place.'
                : 'Try a different search term.'}
            </p>
            {items.length === 0 && (
              <button
                type="button"
                onClick={openAddModal}
                className="bg-[#1E3A8A] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#1E40AF] transition-all inline-flex items-center gap-2"
              >
                <FaPlus /> Add your first item
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Product Details</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Stock Level</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredItems.map((item) => {
                  const status = getStockStatus(item);
                  const stock = Number(item.stock) || 0;
                  const barWidth =
                    stock === 0 ? '0%' : stock <= 5 ? '33%' : '75%';
                  const barColor =
                    stock === 0 ? 'bg-red-500' : stock <= 5 ? 'bg-orange-500' : 'bg-blue-600';

                  return (
                    <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                            <FaBox />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium uppercase">{item.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-500">{item.sku}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${barColor}`}
                              style={{ width: barWidth }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-700">{stock} units</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-800">{item.price}</td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase ${status.className}`}>
                          {status.label === 'In Stock' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            aria-label="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item._id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            aria-label="Delete"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-white flex flex-col animate-in fade-in duration-300">
          {/* Modal Header */}
          <div className="bg-[#1E3A8A] p-6 text-white flex items-center justify-between shrink-0">
            <h3 className="text-xl font-bold">{isEditMode ? 'Edit item' : 'Add new item'}</h3>
            <button type="button" onClick={closeModal} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <FaTimes size={24} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto bg-white p-6 md:p-12">
            <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Machine name *</label>
                  <input 
                    required 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base font-bold outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all"
                    placeholder="e.g. Fully Automatic Paper Cup Machine"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">SKU *</label>
                  <input 
                    required 
                    value={formData.sku} 
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })} 
                    disabled={isEditMode} 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base font-bold outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="e.g. PCM-2024-001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Category *</label>
                  <input 
                    required 
                    value={formData.category} 
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base font-bold outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all" 
                    placeholder="e.g. Paper Cup" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Price *</label>
                  <input 
                    required 
                    value={formData.price} 
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base font-bold outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all" 
                    placeholder="e.g. ₹4.5L" 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Stock quantity *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value === '' ? '' : Number(e.target.value) })}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base font-bold outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all"
                  placeholder="Current stock level"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base font-medium outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all resize-none"
                  placeholder="Enter detailed specifications or notes about this machine..."
                />
              </div>

              <div className="pt-8 flex flex-col sm:flex-row gap-6">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="flex-1 py-5 px-8 border-2 border-slate-200 text-slate-600 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] py-5 px-8 bg-[#1E3A8A] text-white rounded-2xl font-bold text-lg hover:bg-[#1E40AF] transition-all shadow-2xl shadow-blue-900/20"
                >
                  {isEditMode ? 'Update Inventory' : 'Add to Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
