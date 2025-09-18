
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Calculator, FileSpreadsheet } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ExcelFormData, STRUCTURE_OPTIONS, TREATMENT_OPTIONS } from '@/lib/types';

interface ExcelFormProps {
  onSubmit: (data: ExcelFormData) => void;
  isProcessing: boolean;
  hasFile: boolean;
}

export function ExcelForm({ onSubmit, isProcessing, hasFile }: ExcelFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ExcelFormData>({
    defaultValues: {
      diameterInitial: 0,
      diameterFinal: 0,
      carbonPercentage: 0,
      structure: 'P',
      treatment: 'descaled',
      numberOfPasses: 1,
      benchMarkSpeed: 0
    }
  });

  const structureValue = watch('structure');
  const treatmentValue = watch('treatment');

  const handleFormSubmit = (data: ExcelFormData) => {
    onSubmit(data);
  };

  const formFields = [
    {
      name: 'diameterInitial' as const,
      label: 'Diameter Initial',
      type: 'number',
      step: '0.01',
      placeholder: '0.00',
      validation: {
        required: 'Diameter Initial é obrigatório',
        min: { value: 0.01, message: 'Valor deve ser maior que 0' }
      }
    },
    {
      name: 'diameterFinal' as const,
      label: 'Diameter Final',
      type: 'number',
      step: '0.01',
      placeholder: '0.00',
      validation: {
        required: 'Diameter Final é obrigatório',
        min: { value: 0.01, message: 'Valor deve ser maior que 0' }
      }
    },
    {
      name: 'carbonPercentage' as const,
      label: '%C (Carbon Percentage)',
      type: 'number',
      step: '0.001',
      placeholder: '0.000',
      validation: {
        required: '%C é obrigatório',
        min: { value: 0, message: 'Valor deve ser maior ou igual a 0' },
        max: { value: 100, message: 'Valor deve ser menor ou igual a 100' }
      }
    },
    {
      name: 'numberOfPasses' as const,
      label: 'Number of Passes',
      type: 'number',
      step: '1',
      placeholder: '1',
      validation: {
        required: 'Number of Passes é obrigatório',
        min: { value: 1, message: 'Valor deve ser pelo menos 1' }
      }
    },
    {
      name: 'benchMarkSpeed' as const,
      label: 'Bench Mark Speed',
      type: 'number',
      step: '1',
      placeholder: '0',
      validation: {
        required: 'Bench Mark Speed é obrigatório',
        min: { value: 0, message: 'Valor deve ser maior ou igual a 0' }
      }
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-blue-600" />
          Parâmetros de Cálculo
        </CardTitle>
        <CardDescription>
          Preencha os dados que serão inseridos na planilha Excel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formFields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name} className="text-sm font-medium">
                  {field.label}
                </Label>
                <Input
                  id={field.name}
                  type={field.type}
                  step={field.step}
                  placeholder={field.placeholder}
                  {...register(field.name, field.validation)}
                  className={errors[field.name] ? 'border-red-500' : ''}
                  disabled={isProcessing}
                />
                {errors[field.name] && (
                  <p className="text-sm text-red-600">
                    {errors[field.name]?.message}
                  </p>
                )}
              </div>
            ))}

            {/* Structure Select */}
            <div className="space-y-2">
              <Label htmlFor="structure" className="text-sm font-medium">
                Structure (*)
              </Label>
              <Select
                value={structureValue || 'P'}
                onValueChange={(value) => setValue('structure', value as 'P' | 'W' | 'R')}
                disabled={isProcessing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a estrutura" />
                </SelectTrigger>
                <SelectContent>
                  {STRUCTURE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.value} - {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Treatment Select */}
            <div className="space-y-2">
              <Label htmlFor="treatment" className="text-sm font-medium">
                Treatment
              </Label>
              <Select
                value={treatmentValue || 'descaled'}
                onValueChange={(value) => setValue('treatment', value as 'descaled' | 'descaled+coating' | 'pickled')}
                disabled={isProcessing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tratamento" />
                </SelectTrigger>
                <SelectContent>
                  {TREATMENT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              size="lg"
              disabled={!hasFile || isProcessing}
              className="min-w-[200px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <Calculator className="w-4 h-4 mr-2" />
              {isProcessing ? 'Calculando...' : 'Calcular'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
