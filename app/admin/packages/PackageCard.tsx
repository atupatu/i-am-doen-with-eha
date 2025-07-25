"use client"

import { useState } from "react"
import { Heart, Edit, Trash2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Package {
  pid: number;
  name: string;
  description: string | null;
  cost: string;
  duration: string;
  min_commitment: string | null;
}

interface PackageFormData {
  name: string;
  description: string;
  cost: string;
  duration: string;
  min_commitment: string;
}

interface PackageCardProps {
  package: Package;
  onUpdate: () => void;
}

export default function PackageCard({ package: pkg, onUpdate }: PackageCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PackageFormData>({
    name: pkg.name,
    description: pkg.description || '',
    cost: pkg.cost,
    duration: pkg.duration,
    min_commitment: pkg.min_commitment || '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Handle form input changes
  const handleInputChange = (field: keyof PackageFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle edit package
  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      name: pkg.name,
      description: pkg.description || '',
      cost: pkg.cost,
      duration: pkg.duration,
      min_commitment: pkg.min_commitment || '',
    });
  };

  // Handle update package
  const handleUpdate = async () => {
    if (!formData.name || !formData.cost || !formData.duration) {
      alert('Please fill in all required fields (Name, Cost, Duration)');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/packages/${pkg.pid}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          cost: formData.cost,
          duration: formData.duration,
          min_commitment: formData.min_commitment || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update package');
      }

      await onUpdate();
      setIsEditing(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update package');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete package
  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete the package "${pkg.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/packages/${pkg.pid}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete package');
      }

      await onUpdate();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete package');
    }
  };

  // Cancel edit
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: pkg.name,
      description: pkg.description || '',
      cost: pkg.cost,
      duration: pkg.duration,
      min_commitment: pkg.min_commitment || '',
    });
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg">
      {isEditing ? (
        // Edit Form
        <div>
          <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            <Edit className="h-5 w-5 mr-2 text-[#a98cc8]" />
            Edit Package
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#a98cc8] focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#a98cc8] focus:border-transparent text-sm"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost *
              </label>
              <input
                type="text"
                value={formData.cost}
                onChange={(e) => handleInputChange('cost', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#a98cc8] focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration *
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#a98cc8] focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min. Commitment
              </label>
              <input
                type="text"
                value={formData.min_commitment}
                onChange={(e) => handleInputChange('min_commitment', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#a98cc8] focus:border-transparent text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <Button
              onClick={handleUpdate}
              disabled={submitting}
              className="flex-1 bg-sky-500 hover:bg-sky-600 text-white text-sm py-2"
            >
              <Save className="h-3 w-3 mr-1" />
              {submitting ? 'Saving...' : 'Save'}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={submitting}
              className="flex-1 text-sm py-2"
            >
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        // Display Mode
        <div>
          <div className="bg-[#f4c9c8]/30 p-4 rounded-full inline-block mb-6">
            <Heart className="h-8 w-8 text-[#a98cc8]" />
          </div>
          
          <h2 className="text-2xl font-bold mb-4 text-gray-800">{pkg.name}</h2>
          
          {pkg.description && (
            <p className="text-gray-600 mb-6">{pkg.description}</p>
          )}
          
          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start justify-between gap-3">
                <span className="text-gray-700 font-medium whitespace-nowrap">Cost:</span>
                <span className="text-[#a98cc8] font-bold text-right leading-tight">{pkg.cost}</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start justify-between gap-3">
                <span className="text-gray-700 font-medium whitespace-nowrap">Duration:</span>
                <span className="text-gray-800 text-right leading-tight">{pkg.duration}</span>
              </div>
            </div>
            
            {pkg.min_commitment && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-gray-700 font-medium whitespace-nowrap">Min. Commitment:</span>
                  <span className="text-gray-800 text-right leading-tight">{pkg.min_commitment}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleEdit}
              className="flex-1 bg-sky-500 hover:bg-sky-600 text-white"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              onClick={handleDelete}
              className="flex-1 bg-rose-500 hover:bg-rose-600 text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}