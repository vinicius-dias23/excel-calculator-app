
import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';
import { ExcelFormData, EXCEL_CELLS } from '@/lib/types';

// Enhanced processing using XLSX library with proper number formatting
async function processWithXLSX(buffer: Buffer, data: ExcelFormData): Promise<Buffer> {
  console.log('🎯 Processamento aprimorado - preservando formatação e tratando números...');
  
  // Read workbook with ALL options to preserve everything
  const workbook = XLSX.read(buffer, { 
    type: 'buffer', 
    cellFormula: true, 
    cellStyles: true,
    cellHTML: true,
    cellDates: true,
    cellNF: true,     // Preserve number formats
    bookVBA: true,    // Preserve VBA/macros
    raw: false,
    dense: false
  });
  
  // Get first worksheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  if (!worksheet) {
    throw new Error('Nenhuma planilha encontrada');
  }

  console.log('📋 Planilha carregada:', sheetName);

  // Helper function to properly format numeric values
  const formatNumericValue = (value: any): { v: any, t: string } => {
    if (typeof value === 'number') {
      return { v: value, t: 'n' };
    }
    // Handle string numbers with comma as decimal separator (PT/BR format)
    if (typeof value === 'string' && /^\d+[,.]?\d*$/.test(value)) {
      const numValue = parseFloat(value.replace(',', '.'));
      return { v: numValue, t: 'n' };
    }
    return { v: value, t: 's' };
  };

  // Update ONLY the specific cell VALUES - preserve everything else completely
  const cellUpdates = {
    [EXCEL_CELLS.diameterInitial]: data.diameterInitial,
    [EXCEL_CELLS.diameterFinal]: data.diameterFinal,
    [EXCEL_CELLS.carbonPercentage]: data.carbonPercentage,
    [EXCEL_CELLS.structure]: data.structure,
    [EXCEL_CELLS.treatment]: data.treatment,
    [EXCEL_CELLS.numberOfPasses]: data.numberOfPasses,
    [EXCEL_CELLS.benchMarkSpeed]: data.benchMarkSpeed
  };

  // Apply updates ultra-conservatively - preserve ALL original properties
  Object.entries(cellUpdates).forEach(([cellAddress, value]) => {
    console.log(`📝 Atualizando célula ${cellAddress} com valor:`, value);
    
    if (worksheet[cellAddress]) {
      // Get existing cell to preserve ALL properties
      const existingCell = { ...worksheet[cellAddress] };
      const formattedValue = formatNumericValue(value);
      
      console.log(`   Original cell:`, existingCell);
      console.log(`   Formatted value:`, formattedValue);
      
      // Ultra-conservative update: keep EVERYTHING except value and type
      worksheet[cellAddress] = {
        ...existingCell,     // Preserve ALL original properties
        v: formattedValue.v, // Update only the value
        t: formattedValue.t  // Update only the type
      };
      
      // Extra preservation for number format if it exists
      if (existingCell.z) {
        worksheet[cellAddress].z = existingCell.z; // Preserve number format
      }
      if (existingCell.s) {
        worksheet[cellAddress].s = existingCell.s; // Preserve style
      }
      
    } else {
      // Create new cell with minimal properties
      const formattedValue = formatNumericValue(value);
      worksheet[cellAddress] = {
        v: formattedValue.v,
        t: formattedValue.t
      };
    }
    
    console.log(`✅ Célula ${cellAddress} atualizada:`, worksheet[cellAddress]);
  });

  // Enhanced recalculation trigger
  console.log('🎯 Configurando recálculo automático...');
  
  if (!workbook.Workbook) workbook.Workbook = {};
  
  // Force full recalculation with enhanced settings
  (workbook.Workbook as any).calcPr = {
    calcCompleted: false,
    calcOnSave: true,
    fullCalcOnLoad: true,
    calcMode: 'automatic',
    refMode: 'A1'
  };
  
  // Preserve all workbook properties
  if (!workbook.Props) workbook.Props = {};
  workbook.Props.Application = 'Microsoft Office Excel';
  
  // Write with maximum preservation - no compression to avoid format loss
  const output = XLSX.write(workbook, {
    type: 'buffer',
    bookType: 'xlsm',
    bookVBA: true,      // Preserve VBA/macros
    compression: false, // No compression to preserve everything
    cellStyles: true    // Preserve styles
  } as any);
  
  console.log('✅ Processamento aprimorado concluído - formatação 100% preservada, números corretamente formatados');
  return output as Buffer;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const dataString = formData.get('data') as string;

    if (!file || !dataString) {
      return NextResponse.json(
        { error: 'Arquivo e dados são obrigatórios' },
        { status: 400 }
      );
    }

    const data: ExcelFormData = JSON.parse(dataString);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(`📁 Arquivo recebido: ${file.name} (${buffer.length} bytes)`);
    
    // Try processing with XLSX library first (better for .xlsm files with macros)
    let outputBuffer: Buffer;
    const isXlsmFile = file.name.toLowerCase().endsWith('.xlsm');
    
    if (isXlsmFile) {
      try {
        console.log('🎯 Arquivo .xlsm detectado - usando processamento especializado...');
        outputBuffer = await processWithXLSX(buffer, data);
        
        // Return the processed file
        return new NextResponse(outputBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="calculated_${file.name}"`,
            'Content-Length': outputBuffer.byteLength.toString(),
          },
        });
      } catch (xlsxError) {
        console.warn('⚠️  Processamento XLSX falhou, tentando com ExcelJS...', xlsxError);
      }
    }

    // Fallback to ExcelJS processing
    console.log('🔄 Usando processamento ExcelJS...');
    const workbook = new ExcelJS.Workbook();
    
    try {
      // Load the Excel file
      await workbook.xlsx.load(buffer);
    } catch (error) {
      console.error('Erro ao carregar arquivo Excel:', error);
      return NextResponse.json(
        { error: 'Erro ao carregar arquivo Excel. Verifique se o arquivo não está corrompido.' },
        { status: 400 }
      );
    }

    // Get the first worksheet
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      return NextResponse.json(
        { error: 'Nenhuma planilha encontrada no arquivo' },
        { status: 400 }
      );
    }

    // Update cells with form data
    const cellUpdates = {
      [EXCEL_CELLS.diameterInitial]: data.diameterInitial,
      [EXCEL_CELLS.diameterFinal]: data.diameterFinal,
      [EXCEL_CELLS.carbonPercentage]: data.carbonPercentage,
      [EXCEL_CELLS.structure]: data.structure,
      [EXCEL_CELLS.treatment]: data.treatment,
      [EXCEL_CELLS.numberOfPasses]: data.numberOfPasses,
      [EXCEL_CELLS.benchMarkSpeed]: data.benchMarkSpeed
    };

    // Enhanced formatting preservation with proper number handling
    Object.entries(cellUpdates).forEach(([cellAddress, value]) => {
      try {
        const cell = worksheet.getCell(cellAddress);
        
        console.log(`📝 Célula ${cellAddress} antes:`, {
          value: cell.value,
          type: cell.type,
          numFmt: cell.numFmt,
          font: cell.font,
          fill: cell.fill,
          border: cell.border
        });
        
        // Store ALL original formatting properties
        const originalFormat = {
          numFmt: cell.numFmt,
          font: cell.font ? { ...cell.font } : null,
          fill: cell.fill ? { ...cell.fill } : null,
          border: cell.border ? { ...cell.border } : null,
          alignment: cell.alignment ? { ...cell.alignment } : null,
          protection: cell.protection ? { ...cell.protection } : null
        };
        
        // Handle numeric values properly (convert comma to dot for decimals)
        let processedValue = value;
        if (typeof value === 'string' && /^\d+[,.]?\d*$/.test(value)) {
          processedValue = parseFloat(value.replace(',', '.'));
          console.log(`🔢 Convertendo '${value}' para número: ${processedValue}`);
        }
        
        // ONLY change the value, keep everything else
        cell.value = processedValue;
        
        // Immediately restore ALL original formatting (ExcelJS sometimes loses it)
        if (originalFormat.numFmt) cell.numFmt = originalFormat.numFmt;
        if (originalFormat.font) cell.font = originalFormat.font;
        if (originalFormat.fill) cell.fill = originalFormat.fill;
        if (originalFormat.border) cell.border = originalFormat.border;
        if (originalFormat.alignment) cell.alignment = originalFormat.alignment;
        if (originalFormat.protection) cell.protection = originalFormat.protection;
        
        console.log(`✅ Célula ${cellAddress} atualizada com valor numérico e formatação preservada:`, processedValue);
        
      } catch (error) {
        console.warn(`❌ Erro ao atualizar célula ${cellAddress}:`, error);
      }
    });

    // Strategy: Simulate cell selection change to trigger recalculation
    console.log('🎯 Simulando mudança de célula selecionada (como o usuário faz manualmente)...');
    
    // Method 1: Set active/selected cell to trigger recalc
    try {
      // Set first cell as selected, then change to another to trigger recalc
      worksheet.views = [{
        activeCell: 'A1',
        showGridLines: true,
        showRowColHeaders: true,
        rightToLeft: false
      } as any];
      
      // Then change to A2 to simulate movement (immediate, no setTimeout in server)
      worksheet.views = [{
        activeCell: 'A2',
        showGridLines: true,
        showRowColHeaders: true,
        rightToLeft: false
      } as any];
      
    } catch (error) {
      console.log('ℹ️  Não foi possível definir célula ativa');
    }

    // Method 2: Enhanced formula recalculation with complete formatting preservation
    let formulaCount = 0;
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
        if (cell.type === ExcelJS.ValueType.Formula) {
          formulaCount++;
          const originalFormula = cell.formula;
          
          // Store COMPLETE original formatting
          const originalFormat = {
            numFmt: cell.numFmt,
            font: cell.font ? { ...cell.font } : null,
            fill: cell.fill ? { ...cell.fill } : null,
            border: cell.border ? { ...cell.border } : null,
            alignment: cell.alignment ? { ...cell.alignment } : null,
            protection: cell.protection ? { ...cell.protection } : null
          };
          
          if (originalFormula) {
            // Force recalculation by re-setting formula
            cell.value = { formula: originalFormula };
            
            // Restore ALL formatting immediately
            if (originalFormat.numFmt) cell.numFmt = originalFormat.numFmt;
            if (originalFormat.font) cell.font = originalFormat.font;
            if (originalFormat.fill) cell.fill = originalFormat.fill;
            if (originalFormat.border) cell.border = originalFormat.border;
            if (originalFormat.alignment) cell.alignment = originalFormat.alignment;
            if (originalFormat.protection) cell.protection = originalFormat.protection;
            
            console.log(`🔄 Fórmula preservada e recalculada com formatação completa: ${cell.address}`);
          }
        }
      });
    });

    // Method 3: Set workbook for full recalculation on load
    if (workbook.calcProperties) {
      workbook.calcProperties.fullCalcOnLoad = true;
    } else {
      workbook.calcProperties = {
        fullCalcOnLoad: true
      };
    }

    console.log(`✅ Processamento concluído - ${formulaCount} fórmulas processadas, formatação preservada`);

    // Generate output buffer
    outputBuffer = Buffer.from(await workbook.xlsx.writeBuffer());

    // Return the processed file
    return new NextResponse(outputBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="calculated_${file.name}"`,
        'Content-Length': outputBuffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('Erro no processamento:', error);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor ao processar arquivo',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'API endpoint para processamento de arquivos Excel' },
    { status: 200 }
  );
}
