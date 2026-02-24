codeunit 50158 "Create Sales Invoice Lines"
{
    procedure CreateInvoiceLines(var SalesHeader: Record "Sales Header"; var ImportLog: Record "ImportLogTable"; var ConfExcel: Record "Conf. Importacion Excel")
    var
        SalesLine: Record "Sales Line";
        TotalLinesAmount: Decimal;
        LineAmount: Decimal;
        VATGroups: array[3] of Code[20];
        BaseAmounts: array[3] of Decimal;
        i: Integer;
        CompAmount: Decimal;
    begin
        // Assign VAT groups from configuration
        VATGroups[1] := ConfExcel."VAT10";
        VATGroups[2] := ConfExcel."VAT4";
        VATGroups[3] := ConfExcel."VAT21";

        // Assign base amounts from Excel import
        BaseAmounts[1] := ImportLog."T.10% Base";
        BaseAmounts[2] := ImportLog."T.4% Base";
        BaseAmounts[3] := ImportLog."T.21% Base";

        TotalLinesAmount := 0;

        // Loop through each tax type and create a line if base > 0
        for i := 1 to 3 do begin
            if BaseAmounts[i] <> 0 then begin
                SalesLine.Init();
                SalesLine."Document Type" := SalesHeader."Document Type";
                SalesLine."Document No." := SalesHeader."No.";

                // Correct Option value for G/L Account
                SalesLine.Type := SalesLine.Type::"G/L Account";

                // Default account from configuration
                SalesLine."No." := ConfExcel."Account No.";

                // Quantity and amount
                SalesLine.Quantity := 1;
                SalesLine.Amount := BaseAmounts[i];

                // VAT Product Posting Group (requires table extension if not standard)
                SalesLine."VAT Product Posting Group" := VATGroups[i];

                // Insert line
                SalesLine.Insert(true);

                TotalLinesAmount += BaseAmounts[i];
            end;
        end;

        // Create compensation line if total Excel amount ≠ sum of lines
        CompAmount := ImportLog."Total" - TotalLinesAmount;
        if CompAmount <> 0 then begin
            SalesLine.Init();
            SalesLine."Document Type" := SalesHeader."Document Type";
            SalesLine."Document No." := SalesHeader."No.";
            SalesLine.Type := SalesLine.Type::"G/L Account";
            SalesLine."No." := ConfExcel."Compensation Account No.";
            SalesLine.Quantity := 1;
            SalesLine.Amount := CompAmount;
            SalesLine."VAT Product Posting Group" := ConfExcel."VATComp";

            SalesLine.Insert(true);
        end;
    end;
}
