
'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { FileUpload } from './file-upload';
import { ExcelForm } from './excel-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { ExcelFormData } from '@/lib/types';

export function ExcelCalculator() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFile, setProcessedFile] = useState<Blob | null>(null);
  const [processedFileName, setProcessedFileName] = useState<string>('');
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | 'info' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setProcessedFile(null);
    setStatus({ type: 'info', message: 'Arquivo carregado. Preencha os dados e clique em Calcular.' });
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setProcessedFile(null);
    setStatus({ type: null, message: '' });
  };

  const handleFormSubmit = async (data: ExcelFormData) => {
    if (!selectedFile) {
      setStatus({ type: 'error', message: 'Nenhum arquivo selecionado.' });
      return;
    }

    setIsProcessing(true);
    setStatus({ type: 'info', message: 'Processando planilha...' });

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('data', JSON.stringify(data));

      const response = await fetch('/api/process-excel', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao processar arquivo');
      }

      const blob = await response.blob();
      const fileName = `calculated_${selectedFile.name}`;
      
      setProcessedFile(blob);
      setProcessedFileName(fileName);
      setStatus({ 
        type: 'success', 
        message: 'Planilha processada com sucesso! Formatação original preservada, valores atualizados, cálculos executados. Clique em "Download".' 
      });

    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      setStatus({ 
        type: 'error', 
        message: 'Erro ao processar arquivo. Verifique se o arquivo está no formato correto.' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedFile || !processedFileName) return;

    const url = URL.createObjectURL(processedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = processedFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setStatus({ type: 'success', message: 'Download iniciado!' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-blue-600 rounded-lg shadow-md">
              <FileSpreadsheet className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Excel Calculator Interface
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Interface amigável para calculadora complexa em Excel. 
            Preserve sua formatação original - apenas os valores serão alterados!
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-sm text-green-800">
              <strong>✅ Garantido:</strong> Sua planilha retornará com as <strong>mesmas cores, fontes e formatação original</strong>, 
              mas com os valores atualizados e cálculos executados automaticamente.
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-sm text-blue-800">
              <strong>📋 Como usar:</strong> 1) Upload da planilha .xlsm original 
              2) Insira os novos valores 3) Clique "Calcular" 
              4) Baixe a planilha idêntica com resultados atualizados
            </p>
          </div>
        </div>

        {/* Status Alert */}
        {status.type && (
          <Alert 
            variant={status.type === 'error' ? 'destructive' : 'default'}
            className={`${
              status.type === 'success' ? 'border-green-300 bg-green-50 text-green-800' : 
              status.type === 'info' ? 'border-blue-300 bg-blue-50 text-blue-800' : ''
            }`}
          >
            {status.type === 'success' && <CheckCircle className="h-4 w-4" />}
            {status.type === 'error' && <AlertCircle className="h-4 w-4" />}
            {status.type === 'info' && <FileSpreadsheet className="h-4 w-4" />}
            <AlertTitle className="capitalize">{status.type}</AlertTitle>
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}

        {/* File Upload Section */}
        <FileUpload
          onFileSelect={handleFileSelect}
          selectedFile={selectedFile}
          onRemoveFile={handleRemoveFile}
          isProcessing={isProcessing}
        />

        {/* Form Section */}
        {selectedFile && (
          <ExcelForm
            onSubmit={handleFormSubmit}
            isProcessing={isProcessing}
            hasFile={!!selectedFile}
          />
        )}

        {/* Download Section */}
        {processedFile && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="w-5 h-5" />
                Arquivo Processado
              </CardTitle>
              <CardDescription className="text-green-700">
                Sua planilha foi calculada com sucesso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-green-800">{processedFileName}</p>
                  <p className="text-sm text-green-600">
                    Arquivo pronto para download
                  </p>
                </div>
                <Button 
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 py-8">
          <p>Calculadora Excel • Versão 1.0 • Interface Web</p>
        </div>
      </div>
    </div>
  );
}
