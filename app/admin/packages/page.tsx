"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import SiteFooter from "@/components/site-footer"
import PackageCard from "./PackageCard"

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

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<PackageFormData>({
    name: '',
    description: '',
    cost: '',
    duration: '',
    min_commitment: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch packages from API
  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/packages');
      
      if (!response.ok) {
        throw new Error('Failed to fetch packages');
      }

      const data = await response.json();
      setPackages(data.packages || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Handle form input changes
  const handleInputChange = (field: keyof PackageFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle create package
  const handleCreate = async () => {
    if (!formData.name || !formData.cost || !formData.duration) {
      alert('Please fill in all required fields (Name, Cost, Duration)');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/packages', {
        method: 'POST',
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
        throw new Error('Failed to create package');
      }

      await fetchPackages();
      setShowCreateForm(false);
      setFormData({
        name: '',
        description: '',
        cost: '',
        duration: '',
        min_commitment: ''
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create package');
    } finally {
      setSubmitting(false);
    }
  };

  // Cancel create
  const handleCancel = () => {
    setShowCreateForm(false);
    setFormData({
      name: '',
      description: '',
      cost: '',
      duration: '',
      min_commitment: ''
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-[#fef6f9] py-16 md:py-24">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl font-bold mb-6 text-gray-800">Package Management</h1>
              <p className="text-lg text-gray-600">
                Manage therapy packages - create, edit, and delete packages for Echoing Healthy Ageing clients.
              </p>
            </div>

            {/* Add Package Button */}
            <div className="mb-8 text-center">
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-[#a98cc8] hover:bg-[#9678b4] text-white"
                disabled={showCreateForm}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Package
              </Button>
            </div>

            {/* Create Package Form */}
            {showCreateForm && (
              <div className="bg-white p-8 rounded-3xl shadow-lg mb-8 border-2 border-[#a98cc8]">
                <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                  <Plus className="h-6 w-6 mr-2 text-[#a98cc8]" />
                  Create New Package
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Package Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a98cc8] focus:border-transparent"
                      placeholder="Enter package name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cost *
                    </label>
                    <input
                      type="text"
                      value={formData.cost}
                      onChange={(e) => handleInputChange('cost', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a98cc8] focus:border-transparent"
                      placeholder="e.g., $100/session"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration *
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a98cc8] focus:border-transparent"
                      placeholder="e.g., 60 minutes"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min. Commitment
                    </label>
                    <input
                      type="text"
                      value={formData.min_commitment}
                      onChange={(e) => handleInputChange('min_commitment', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a98cc8] focus:border-transparent"
                      placeholder="e.g., 4 sessions"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a98cc8] focus:border-transparent"
                      rows={3}
                      placeholder="Package description..."
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <Button
                    onClick={handleCreate}
                    disabled={submitting}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    {submitting ? 'Creating...' : 'Create Package'}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#a98cc8]"></div>
                <p className="mt-4 text-gray-600">Loading packages...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <p className="text-red-600">Error loading packages: {error}</p>
                <Button 
                  onClick={fetchPackages} 
                  className="mt-4 bg-[#a98cc8] hover:bg-[#9678b4] text-white"
                >
                  Try Again
                </Button>
              </div>
            )}

            {!loading && !error && packages.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No packages available. Create your first package!</p>
              </div>
            )}

            {!loading && !error && packages.length > 0 && (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {packages.map((pkg) => (
                  <PackageCard
                    key={pkg.pid}
                    package={pkg}
                    onUpdate={fetchPackages}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}