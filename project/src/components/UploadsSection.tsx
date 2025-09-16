import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Trash2, 
  Edit3, 
  Download,
  Plus,
  Search,
  Filter,
  FileImage,
  FileCode,
  Archive,
  Eye,
  Star,
  Clock,
  TrendingUp,
  Cloud
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  type: 'resume' | 'note' | 'project' | 'document';
  size: string;
  uploadDate: string;
  description?: string;
}

const UploadsSection: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [uploaded,setUploaded]=useState(false);
  const [uploadResult,setUploadResult]=useState('');
  // Function to upload PDF to FastAPI backend
  const uploadPdfToBackend = async (file: File) => {
    setIsUploading(true);
    setUploadStatus(`Processing ${file.name}...`);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('http://localhost:3000/upload-pdf/', {
        method: 'POST',
        body: formData,
      });

      const response2 = await fetch('http://localhost:8000/upload-pdf/', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      const result2 = await response2.json();
      if (result.message=='PDF uploaded and indexed successfully.') console.log(result2.message)
      
      if (result.message=='PDF uploaded and indexed successfully.') {
        setUploadStatus(`✅ ${file.name} processed successfully! Created ${result.chunks_created} text chunks.`);
        setUploaded(true);
        setUploadResult(result.message);
        // Add to files list with vector storage info
        const newFile: UploadedFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: 'document',
          size: file.size > 1024 * 1024 
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
            : `${(file.size / 1024).toFixed(0)} KB`,
          uploadDate: new Date().toISOString().split('T')[0],
          description: `PDF processed into ${result.chunks_created} text chunks for RAG`
        };
        setFiles(prev => [newFile, ...prev]);
      } else {
        setUploadStatus(`❌ Failed to process ${file.name}: ${result.message}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus(`❌ Error uploading ${file.name}. Make sure backend is running.`);
    } finally {
      setIsUploading(false);
      // Clear status after 5 seconds
      setTimeout(() => setUploadStatus(''), 5000);
    }
  };

  const [files, setFiles] = useState<UploadedFile[]>([
    {
      id: '1',
      name: 'John_Doe_Resume_2024.pdf',
      type: 'resume',
      size: '245 KB',
      uploadDate: '2025-01-15',
      description: 'Updated resume with latest projects and achievements'
    },
    {
      id: '2',
      name: 'React_Advanced_Notes.md',
      type: 'note',
      size: '15 KB',
      uploadDate: '2025-01-14',
      description: 'Comprehensive technical notes for React development patterns'
    },
    {
      id: '3',
      name: 'E-commerce_Full_Stack.zip',
      type: 'project',
      size: '2.3 MB',
      uploadDate: '2025-01-12',
      description: 'Complete full-stack e-commerce application with React and Node.js'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'resume' | 'note' | 'project' | 'document'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension || '')) {
      return FileImage;
    }
    if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp'].includes(extension || '')) {
      return FileCode;
    }
    if (['zip', 'rar', '7z', 'tar'].includes(extension || '')) {
      return Archive;
    }
    return FileText;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'resume': return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300';
      case 'note': return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300';
      case 'project': return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300';
      case 'document': return 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (file.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || file.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
  };

  const handleEdit = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      setEditingId(id);
      setEditDescription(file.description || '');
    }
  };

  const handleSaveEdit = (id: string) => {
    setFiles(files.map(file => 
      file.id === id 
        ? { ...file, description: editDescription }
        : file
    ));
    setEditingId(null);
    setEditDescription('');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles) {
      for (const file of Array.from(uploadedFiles)) {
        // Only process PDF files for vector storage
        if (file.name.toLowerCase().endsWith('.pdf')) {
          await uploadPdfToBackend(file);
        } else {
          // Handle non-PDF files as before
          const newFile: UploadedFile = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: 'document',
            size: file.size > 1024 * 1024 
              ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
              : `${(file.size / 1024).toFixed(0)} KB`,
            uploadDate: new Date().toISOString().split('T')[0],
            description: `Uploaded ${file.name}`
          };
          setFiles(prev => [newFile, ...prev]);
        }
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0 && fileInputRef.current) {
      fileInputRef.current.files = droppedFiles;
      const event = { target: { files: droppedFiles } } as React.ChangeEvent<HTMLInputElement>;
      handleFileUpload(event);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Enhanced Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-white to-purple-50 rounded-3xl -z-10 transform -skew-y-1"></div>
          <div className="relative py-12 text-center">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 text-lg text-blue-600 font-medium bg-blue-50 px-4 py-2 rounded-full">
                <Cloud className="w-5 h-5" />
                Document Library
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Knowledge</span> Hub
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Organize and manage your resumes, projects, notes, and documents for seamless AI-powered assistance
            </p>
          </div>
        </div>

        {/* Enhanced Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-700 mb-1">{files.length}</div>
            <div className="text-sm font-medium text-blue-600">Total Files</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-700 mb-1">{files.filter(f => f.type === 'resume').length}</div>
            <div className="text-sm font-medium text-green-600">Resumes</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Archive className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-700 mb-1">{files.filter(f => f.type === 'project').length}</div>
            <div className="text-sm font-medium text-purple-600">Projects</div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Edit3 className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-orange-700 mb-1">{files.filter(f => f.type === 'note').length}</div>
            <div className="text-sm font-medium text-orange-600">Notes</div>
          </div>
        </div>

        {/* Enhanced Upload Area */}
        <div 
          className={`relative border-2 border-dashed pb-5 rounded-3xl p-6 text-center transition-all duration-300 ${
            isDragging 
              ? 'border-blue-400 bg-blue-50 scale-102' 
              : 'border-gray-300 bg-gray-50 hover:border-blue-300 hover:bg-blue-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Upload className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-2">Drop files here or click to upload</h3>
          <p className="text-gray-600 mb-4 text-sm">PDF, DOC, TXT, MD, ZIP, PNG, JPG</p>
          
          <label onClick={()=>{setUploaded(false);}} className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg text-sm">
            <Plus className="w-4 h-4" />
            <span>Choose Files</span>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.md,.zip,.png,.jpg,.jpeg,.js,.ts,.py,.java"
            />
          </label>
          <p className={`text-base text-green-800 ${uploaded ? '' : 'hidden'}`}>{uploadResult}</p>

        </div>

        {/* Compact Search and Filter */}
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by filename, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            
            <div className="relative md:w-48">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white font-medium"
              >
                <option value="all">All Types</option>
                <option value="resume">Resumes</option>
                <option value="note">Notes</option>
                <option value="project">Projects</option>
                <option value="document">Documents</option>
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Files Grid */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  Your Files ({filteredFiles.length})
                </h2>
                <p className="text-sm text-gray-600">Ready for AI assistance</p>
              </div>
              {filteredFiles.length > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-700 font-medium">AI Ready</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {filteredFiles.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Your Files</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Drag and drop your files here, or click to browse. PDF files will be processed for AI-powered search.
                  </p>
                  
                  {/* Upload Status */}
                  {uploadStatus && (
                    <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
                      uploadStatus.includes('✅') ? 'bg-green-100 text-green-800' : 
                      uploadStatus.includes('❌') ? 'bg-red-100 text-red-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {uploadStatus}
                    </div>
                  )}
                  
                  {/* Loading indicator */}
                  {isUploading && (
                    <div className="mb-4 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-blue-600">Processing PDF...</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              filteredFiles.map((file) => {
                const FileIcon = getFileIcon(file.name);
                return (
                  <div key={file.id} className="p-4 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-300 group">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1 min-w-0">
                        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-xl group-hover:scale-105 transition-transform duration-300">
                          <FileIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-base font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{file.name}</h3>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-lg border ${getTypeColor(file.type)}`}>
                              {file.type.charAt(0).toUpperCase() + file.type.slice(1)}
                            </span>
                          </div>
                          
                          {editingId === file.id ? (
                            <div className="flex items-center space-x-2 mt-2">
                              <input
                                type="text"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="Add description..."
                              />
                              <button
                                onClick={() => handleSaveEdit(file.id)}
                                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-medium hover:from-green-600 hover:to-green-700 transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-sm text-gray-700 leading-relaxed">{file.description || 'No description available'}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Archive className="w-3 h-3" />
                                  <span className="font-medium">{file.size}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Uploaded {new Date(file.uploadDate).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View file"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(file.id)}
                          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit description"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadsSection;