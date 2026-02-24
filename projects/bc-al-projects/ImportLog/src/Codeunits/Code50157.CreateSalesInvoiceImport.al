codeunit 50157 "Create Sales Invoice"
{
    procedure CreateSalesInvoice(var ImportLog: Record "ImportLogTable")
    var
        SalesHeader: Record "Sales Header";
        ConfExcel: Record "Conf. Importacion Excel";
        NoSeries: Codeunit "No. Series";
    begin
        if not ConfExcel.Get('SETUP') then
            Error('Configuration SETUP not found');

        ConfExcel.TestField("Invoice Serial No.");
        ConfExcel.TestField("Registration Serial No.");

        // Comprovació defensiva: validar que les sèries estiguin relacionades
        NoSeries.TestAreRelated(ConfExcel."Invoice Serial No.", ConfExcel."Registration Serial No.");

        SalesHeader.Init();
        SalesHeader."Document Type" := SalesHeader."Document Type"::Invoice;

        SalesHeader."No. Series" := ConfExcel."Invoice Serial No.";
        SalesHeader."Posting No. Series" := ConfExcel."Registration Serial No.";

        SalesHeader.Validate("Sell-to Customer No.", ImportLog."Customer No.");
        SalesHeader.Validate("Document Date", ImportLog."Date");
        SalesHeader.Validate("Posting Date", ImportLog."Date");

        SalesHeader.Validate("Importe Excel", ImportLog."Total");

        SalesHeader."No." := Format(ImportLog."Number");

        SalesHeader.Insert(true);

        ImportLog."Sales invoice No." := SalesHeader."No.";
        ImportLog.Modify();
    end;
}
