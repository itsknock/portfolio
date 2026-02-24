codeunit 50150 "Import Log Mgt"
{
    SingleInstance = true;

    procedure ImportExcel(var ImportLogRec: Record "ImportLogTable")
    var
        TempExcelBuffer: Record "Excel Buffer";
        FileManagement: Codeunit "File Management";
        TempBlob: Codeunit "Temp Blob";
        FileInStream: InStream;
        SheetName: Text;
        ErrorMessage: Text;
        RowNo: Integer;
        MaxRows: Integer;
        CellValue: Text;
    begin
        // Select and import Excel file
        FileManagement.BLOBImportWithFilter(
            TempBlob,
            'Import file',
            'Excel Item Import',
            FileManagement.GetToFilterText('All Files (*.xlsx)|*.xlsx', '.xlsx'),
            'xlsx'
        );

        if not TempBlob.HasValue() then
            exit;

        TempBlob.CreateInStream(FileInStream);

        // Open Excel sheet
        SheetName := TempExcelBuffer.SelectSheetsNameStream(FileInStream);
        ErrorMessage := TempExcelBuffer.OpenBookStream(FileInStream, SheetName);
        if ErrorMessage <> '' then
            Error(ErrorMessage);

        TempExcelBuffer.ReadSheet();

        // Safe cleanup
        ImportLogRec.Reset();
        ImportLogRec.DeleteAll(true);
        Commit();

        // **FIXED** - Find LAST ROW WITH DATA only
        TempExcelBuffer.Reset();
        MaxRows := FindLastDataRow(TempExcelBuffer);

        // Insert records up to last real data row
        for RowNo := 2 to MaxRows do begin
            ImportLogRec.Init();

            // Text fields - always safe
            ImportLogRec."Company Reason" := CopyStr(GetValueAtCell(RowNo, 1, TempExcelBuffer), 1, 100);
            ImportLogRec."Client Reason" := CopyStr(GetValueAtCell(RowNo, 2, TempExcelBuffer), 1, 100);
            ImportLogRec."CIF/NIF" := CopyStr(GetValueAtCell(RowNo, 3, TempExcelBuffer), 1, 20);
            ImportLogRec.Address := CopyStr(GetValueAtCell(RowNo, 4, TempExcelBuffer), 1, 100);
            ImportLogRec."Post Code" := CopyStr(GetValueAtCell(RowNo, 5, TempExcelBuffer), 1, 20);
            ImportLogRec.City := CopyStr(GetValueAtCell(RowNo, 6, TempExcelBuffer), 1, 50);
            ImportLogRec.Province := CopyStr(GetValueAtCell(RowNo, 7, TempExcelBuffer), 1, 50);
            ImportLogRec.Type := CopyStr(GetValueAtCell(RowNo, 8, TempExcelBuffer), 1, 30);
            ImportLogRec.Series := CopyStr(GetValueAtCell(RowNo, 9, TempExcelBuffer), 1, 10);

            // SAFE Integer evaluation (column 10)
            CellValue := GetValueAtCell(RowNo, 10, TempExcelBuffer);
            if CellValue <> '' then
                if not Evaluate(ImportLogRec.Number, CellValue) then
                    ImportLogRec.Number := 0;

            // SAFE Date evaluation (column 11)
            CellValue := GetValueAtCell(RowNo, 11, TempExcelBuffer);
            if (CellValue <> '') and (CellValue <> 'Sumas totales') then
                if not Evaluate(ImportLogRec.Date, CellValue) then
                    ImportLogRec.Date := 0D;

            // SAFE Decimal evaluations
            SafeEvaluateDecimal(ImportLogRec."T.10% Base", RowNo, 12, TempExcelBuffer);
            SafeEvaluateDecimal(ImportLogRec."T.10% VAT", RowNo, 13, TempExcelBuffer);
            SafeEvaluateDecimal(ImportLogRec."T.4% Base", RowNo, 14, TempExcelBuffer);
            SafeEvaluateDecimal(ImportLogRec."T.4% VAT", RowNo, 15, TempExcelBuffer);
            SafeEvaluateDecimal(ImportLogRec."T.21% Base", RowNo, 16, TempExcelBuffer);
            SafeEvaluateDecimal(ImportLogRec."T.21% VAT", RowNo, 17, TempExcelBuffer);
            SafeEvaluateDecimal(ImportLogRec.Total, RowNo, 18, TempExcelBuffer);

            // Default values per document
            ImportLogRec.Status := ImportLogRec.Status::Pending;
            ImportLogRec.Error := '';

            ImportLogRec.Insert(true);
        end;
    end;

    local procedure FindLastDataRow(var TempExcelBuffer: Record "Excel Buffer"): Integer
    var
        RowNo: Integer;
    begin
        TempExcelBuffer.Reset();
        if TempExcelBuffer.FindLast() then
            repeat
                RowNo := TempExcelBuffer."Row No.";
                if not IsEmptyExcelRow(RowNo, TempExcelBuffer) then
                    exit(RowNo);
            until TempExcelBuffer.Next(-1) = 0;
        exit(1);
    end;

    local procedure IsEmptyExcelRow(RowNo: Integer; var TempExcelBuffer: Record "Excel Buffer"): Boolean
    var
        ColNo: Integer;
        EmptyCount: Integer;
        CellValue: Text;
    begin
        EmptyCount := 0;
        for ColNo := 1 to 9 do begin // Check first 9 columns (key fields)
            CellValue := GetValueAtCell(RowNo, ColNo, TempExcelBuffer);
            if DelChr(CellValue, '=', ' ') = '' then // Remove spaces and check
                EmptyCount += 1;
        end;
        exit(EmptyCount = 9); // Empty if all 9 key columns are blank
    end;

    local procedure SafeEvaluateDecimal(var DecimalField: Decimal; RowNo: Integer; ColNo: Integer; var TempExcelBuffer: Record "Excel Buffer")
    var
        CellValue: Text;
    begin
        CellValue := GetValueAtCell(RowNo, ColNo, TempExcelBuffer);
        if (CellValue <> '') and (CellValue <> 'Sumas totales') then
            Evaluate(DecimalField, CellValue);
    end;

    procedure ProcessLines(var ImportLogRec: Record "ImportLogTable")
    var
        NoPendingLines: Label ' No Pending lines to process.', Comment = 'ESP="No hay líneas pendientes para procesar"';
        SelectedRec: Record "ImportLogTable";
    begin
        SelectedRec.Reset();
        SelectedRec.SetRange(Status, SelectedRec.Status::Pending);
        if SelectedRec.IsEmpty then
            Error(NoPendingLines);

        if not Dialog.Confirm('Process %1 pending lines?', false, SelectedRec.Count) then
            exit;

        SelectedRec.FindSet();
        repeat
            SelectedRec.Status := SelectedRec.Status::Processed;
            SelectedRec.Modify();
        until SelectedRec.Next() = 0;

        Message('Processed %1 lines successfully.', SelectedRec.Count);
    end;

    local procedure GetValueAtCell(RowNo: Integer; ColNo: Integer; var TempExcelBuffer: Record "Excel Buffer"): Text
    begin
        if TempExcelBuffer.Get(RowNo, ColNo) then
            exit(TempExcelBuffer."Cell Value as Text");
        exit('');
    end;
}
