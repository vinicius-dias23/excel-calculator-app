
'use client';

import React, { useState } from 'react';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onRemoveFile: () => void;
  isProcessing: boolean;
}

export function FileUpload({ 
  onFileSelect, 
  selectedFile, 
  onRemoveFile, 
  isProcessing 
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError('');

    const files = e.dataTransfer?.files;
    if (files && files[0]) {
      validateAndSelectFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) {
      validateAndSelectFile(file);
    }
  };

  const validateAndSelectFile = (file: File) => {
    const allowedExtensions = ['.xlsm', '.xlsx'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      setError('Por favor, selecione um arquivo Excel (.xlsm ou .xlsx)');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      setError('Arquivo muito grande. Limite de 50MB');
      return;
    }

    setError('');
    onFileSelect(file);
  };

  return (
    <div className="w-full space-y-4">
      {!selectedFile && (
        <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
          <CardContent className="p-6">
            <div
              className={`
                relative flex flex-col items-center justify-center p-8 rounded-lg transition-colors
                ${dragActive ? 'bg-blue-50 border-blue-300' : 'bg-gray-50'}
                ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !isProcessing && document.getElementById('file-input')?.click()}
            >
              <Upload className={`w-12 h-12 mb-4 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Upload da Planilha Excel
              </h3>
              <p className="text-sm text-gray-500 text-center mb-4">
                Arraste e solte seu arquivo .xlsm aqui ou clique para selecionar
              </p>
              <p className="text-xs text-gray-400">
                Formatos aceitos: .xlsm, .xlsx (máximo 50MB)
              </p>
              
              <input
                id="file-input"
                type="file"
                accept=".xlsm,.xlsx"
                onChange={handleFileInput}
                className="hidden"
                disabled={isProcessing}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {selectedFile && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <File className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-green-600">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemoveFile}
                disabled={isProcessing}
                className="text-red-600 hover:text-red-800 hover:bg-red-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
