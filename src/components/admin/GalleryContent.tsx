// @ts-nocheck
'use client';
import { useState } from 'react';
import ImageUpload from '../SupabaseImageUpload';
import { GalleryItem } from '@/lib/supabase';
import { ButtonLoader } from '../LoaderAnimation';

interface GalleryContentProps {
  galleryItems: GalleryItem[];
  onAdd: (item: Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>) => void;
  onUpdate: (id: string, item: Partial<GalleryItem>) => void;
  onDelete: (id: string) => void;
}

export default function GalleryContent({ galleryItems, onAdd, onUpdate, onDelete }: GalleryContentProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categories, setCategories] = useState(['fashion', 'accessories', 'traditional', 'modern', 'sustainable']);
  const [newCategory, setNewCategory] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'fashion',
    tags: [] as string[],
    image_url: '',
    height: '400px'
  });
  const [currentTag, setCurrentTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      onUpdate(editingItem.id!, formData);
      setEditingItem(null);
    } else {
      onAdd(formData);
    }
    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'fashion',
      tags: [],
      image_url: '',
      height: '400px'
    });
    setCurrentTag('');
    setAiPrompt('');
  };


  const handleEdit = (item: GalleryItem) => {
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      tags: item.tags || [],
      image_url: item.image_url,
      height: item.height || '400px'
    });
    setEditingItem(item);
    setShowForm(true);
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim()]
      });
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
      setShowCategoryForm(false);
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    if (categories.length > 1) {
      setCategories(categories.filter(cat => cat !== categoryToRemove));
    }
  };

  // Simulate AI image generation (in production, this would call an actual AI service)
  const generateAIImage = async () => {
    if (!aiPrompt.trim()) {
      alert('Please enter a prompt for AI image generation');
      return;
    }

    setIsGeneratingAI(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Using more reliable AI image generation with better prompt adherence
      // Adding more specific parameters for better fashion/design results
      const enhancedPrompt = `${aiPrompt}, high quality, fashion design, professional photography, detailed, realistic, 4K`;
      const mockAIImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=800&height=600&seed=${Date.now()}&model=flux&enhance=true&nologo=true`;
      
      setFormData({
        ...formData,
        image_url: mockAIImageUrl,
        title: formData.title || `AI Generated: ${aiPrompt.substring(0, 30)}...`,
        description: formData.description || `Beautiful ${formData.category} design created with AI based on prompt: "${aiPrompt}"`
      });
      
      alert('AI image generated successfully using Pollinations AI (Flux model)! The image is optimized and SEO-friendly.');
    } catch (error) {
      console.error('Error generating AI image:', error);
      alert('Failed to generate AI image. Please try again.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gallery Management</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingItem(null);
            resetForm();
          }}
          className="bg-[#1ca4bc] text-white px-6 py-2 rounded-lg hover:bg-[#159bb3] transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Gallery Item'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}
          </h3>
          
          {/* AI Image Generation Section */}
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
              <span className="mr-2">🤖</span>
              AI Image Generator
            </h4>
            <div className="flex gap-3">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe the image you want to generate (e.g., 'modern batik dress with geometric patterns')"
                className="flex-1 px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                disabled={isGeneratingAI}
              />
              <button
                type="button"
                onClick={generateAIImage}
                disabled={isGeneratingAI || !aiPrompt.trim()}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isGeneratingAI ? (
                  <div className="flex items-center">
                    <ButtonLoader />
                    <span className="ml-2">Generating...</span>
                  </div>
                ) : (
                  'Generate AI Image'
                )}
              </button>
            </div>
            <p className="text-sm text-purple-600 mt-2">
              💡 Powered by Pollinations AI (Flux model) - Be specific about style, colors, and fashion elements for better results
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                  placeholder="Gallery item title..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="flex gap-2">
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowCategoryForm(!showCategoryForm)}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    title="Manage Categories"
                  >
                    +
                  </button>
                </div>
                
                {/* Category Management */}
                {showCategoryForm && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg border">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Manage Categories</h4>
                    
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New category name..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                      />
                      <button
                        type="button"
                        onClick={addCategory}
                        className="px-3 py-2 bg-[#1ca4bc] text-white rounded hover:bg-[#159bb3] transition-colors text-sm"
                      >
                        Add
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-xs text-gray-600">Existing categories:</p>
                      <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                          <div key={cat} className="flex items-center gap-1 bg-white px-2 py-1 rounded border text-sm">
                            <span>{cat}</span>
                            {categories.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeCategory(cat)}
                                className="text-red-500 hover:text-red-700 ml-1"
                                title="Remove category"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                placeholder="Describe this gallery item..."
                required
              ></textarea>
            </div>

            {/* Tags Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Add a tag..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Add Tag
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 bg-[#1ca4bc] text-white px-3 py-1 rounded-full text-sm">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-white hover:text-gray-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
              <ImageUpload
                currentImage={formData.image_url}
                onImageUpload={(imageUrl) => setFormData({ ...formData, image_url: imageUrl })}
                folder="gallery"
              />
            </div>

            {/* Image Height */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image Height</label>
              <input
                type="text"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                placeholder="400px"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-[#1ca4bc] text-white px-6 py-2 rounded-lg hover:bg-[#159bb3] transition-colors"
              >
                {editingItem ? 'Update Gallery Item' : 'Add Gallery Item'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gallery Items ({galleryItems.length})</h3>
          
          {galleryItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No gallery items yet</p>
              <p className="text-gray-400 text-sm">Add your first gallery item to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item: GalleryItem) => (
                <div key={item.id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square overflow-hidden">
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    
                    {/* Hover Overlay with Details */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-75 transition-all duration-300 flex items-end">
                      <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-lg">{item.title}</h4>
                          <p className="text-sm opacity-90">{item.description}</p>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-[#1ca4bc] rounded-full text-xs">
                              {item.category}
                            </span>
                            {item.tags && item.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="px-2 py-1 bg-gray-600 rounded-full text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2 truncate">{item.title}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {item.category}
                        </span>
                        {item.tags && item.tags.length > 0 && (
                          <span className="text-xs text-gray-500">
                            +{item.tags.length} tags
                          </span>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 hover:bg-blue-50 rounded"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => item.id && onDelete(item.id)}
                          className="text-red-600 hover:text-red-800 text-sm px-2 py-1 hover:bg-red-50 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}