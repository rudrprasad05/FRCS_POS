"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type Warehouse = {
  id: number;
  name: string;
  location: string;
  totalBatches: number;
  totalDistinctProducts: number;
};

type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: T;
  errors?: string[];
};

export default function WarehouseDataPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [newWarehouse, setNewWarehouse] = useState({ name: "", location: "" });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch warehouses
  const fetchWarehouses = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/warehouses`);
      const json: ApiResponse<Warehouse[]> = await res.json();
      if (json.success && json.data) {
        setWarehouses(json.data);
      } else {
        toast(json.message || "Failed to fetch warehouses");
      }
    } catch (err) {
      console.error(err);
      toast("Error fetching warehouses");
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  // Create warehouse
  const handleCreate = async () => {
    if (!newWarehouse.name || !newWarehouse.location) {
      toast("Please fill in all fields");
      return;
    }
    
    // IMPORTANT: You need a valid companyId from your database.
    // Replace '1' with an actual companyId.
    const companyId = 1; 

    // Create the request body with the companyId
    const dataToSend = {
      ...newWarehouse,
      companyId: companyId
    };

    try {
      const res = await fetch(`${API_BASE_URL}/warehouses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      const json: ApiResponse<Warehouse> = await res.json();
      if (json.success && json.data) {
        toast(json.message || "Warehouse created");
        setNewWarehouse({ name: "", location: "" });
        fetchWarehouses();
      } else {
        toast(json.message || "Failed to create warehouse");
      }
    } catch (err) {
      console.error(err);
      toast("Error creating warehouse");
    }
  };

  // Update warehouse
  const handleUpdate = async () => {
    if (!editingWarehouse) return;
    if (!editingWarehouse.name || !editingWarehouse.location) {
      toast("Please fill in all fields");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/warehouses/${editingWarehouse.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingWarehouse),
      });
      const json: ApiResponse<Warehouse> = await res.json();
      if (json.success && json.data) {
        toast(json.message || "Warehouse updated");
        setEditingWarehouse(null);
        fetchWarehouses();
      } else {
        toast(json.message || "Failed to update warehouse");
      }
    } catch (err) {
      console.error(err);
      toast("Error updating warehouse");
    }
  };

  // Delete warehouse
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this warehouse?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/warehouses/${id}`, { method: "DELETE" });
      const json: ApiResponse<boolean> = await res.json();
      if (json.success) {
        toast(json.message || "Warehouse deleted");
        fetchWarehouses();
      } else {
        toast(json.message || "Failed to delete warehouse");
      }
    } catch (err) {
      console.error(err);
      toast("Error deleting warehouse");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Warehouse Management</h1>

      {/* Add New Warehouse */}
      <div className="mb-6 border p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Add New Warehouse</h2>
        <input
          type="text"
          placeholder="Name"
          value={newWarehouse.name}
          onChange={(e) => setNewWarehouse({ ...newWarehouse, name: e.target.value })}
          className="border px-2 py-1 mr-2"
        />
        <input
          type="text"
          placeholder="Location"
          value={newWarehouse.location}
          onChange={(e) => setNewWarehouse({ ...newWarehouse, location: e.target.value })}
          className="border px-2 py-1 mr-2"
        />
        <button onClick={handleCreate} className="bg-green-500 text-white px-4 py-1 rounded">
          Add
        </button>
      </div>

      {/* Edit Warehouse */}
      {editingWarehouse && (
        <div className="mb-6 border p-4 rounded bg-yellow-50">
          <h2 className="text-lg font-semibold mb-2">Edit Warehouse</h2>
          <input
            type="text"
            value={editingWarehouse.name}
            onChange={(e) =>
              setEditingWarehouse({ ...editingWarehouse, name: e.target.value })
            }
            className="border px-2 py-1 mr-2"
          />
          <input
            type="text"
            value={editingWarehouse.location}
            onChange={(e) =>
              setEditingWarehouse({ ...editingWarehouse, location: e.target.value })
            }
            className="border px-2 py-1 mr-2"
          />
          <div className="flex gap-2 mt-2">
            <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-1 rounded">
              Save
            </button>
            <button
              onClick={() => setEditingWarehouse(null)}
              className="bg-gray-400 text-white px-4 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Warehouse List */}
      <div className="border p-4 rounded">
        <h2 className="text-lg font-semibold mb-4">All Warehouses</h2>
        {warehouses.length === 0 ? (
          <p>No warehouses found.</p>
        ) : (
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Name</th>
                <th className="border p-2">Location</th>
                <th className="border p-2">Batches</th>
                <th className="border p-2">Products</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map((warehouse) => (
                <tr key={warehouse.id}>
                  <td className="border p-2">{warehouse.name}</td>
                  <td className="border p-2">{warehouse.location}</td>
                  <td className="border p-2">{warehouse.totalBatches}</td>
                  <td className="border p-2">{warehouse.totalDistinctProducts}</td>
                  <td className="border p-2 flex gap-2">
                    <button
                      onClick={() => setEditingWarehouse(warehouse)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(warehouse.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}