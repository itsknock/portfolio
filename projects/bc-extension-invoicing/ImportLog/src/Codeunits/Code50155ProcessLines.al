codeunit 50155 "Process import lines"
{
    procedure ProcessImportLines(var ImportLogRec: Record "ImportLogTable")
    var
        Customer: Record Customer;
        ConfExcel: Record "Conf. Importacion Excel";
        CreateSalesInvoice: Codeunit "Create Sales Invoice";
        CIFEmptyErr: Label 'CIF/NIF is empty in line %1', Comment = 'ESP="El CIF/NIF está vacío en la línea %1"';
    begin
        if ImportLogRec.IsEmpty() then
            exit;

        if ImportLogRec.FindSet() then
            repeat
                if ImportLogRec."CIF/NIF" = '' then
                    Error(CIFEmptyErr, ImportLogRec."CIF/NIF");

                Customer.Reset();
                Customer.SetRange("VAT Registration No.", ImportLogRec."CIF/NIF");

                if Customer.FindFirst() then begin
                    UpdateCustomer(Customer, ImportLogRec);
                    ImportLogRec."Customer No." := Customer."No.";
                    ImportLogRec."Client process Status" := ImportLogRec."Client process Status"::Updated;
                end else begin
                    if not ConfExcel.Get('SETUP') then
                        Error('Configuration record SETUP not found');

                    ConfExcel.TestField("Customer Template");

                    CreateCustomerFromTemplate(Customer, ConfExcel."Customer Template", ImportLogRec);
                    ImportLogRec."Customer No." := Customer."No.";
                    ImportLogRec."Client process Status" := ImportLogRec."Client process Status"::Created;
                end;

                CreateSalesInvoice.CreateSalesInvoice(ImportLogRec);

                ImportLogRec.Status := ImportLogRec.Status::Processed;
                ImportLogRec.Modify(true);

            until ImportLogRec.Next() = 0;
    end;

    local procedure UpdateCustomer(var Customer: Record Customer; ImportLogRec: Record "ImportLogTable")
    begin
        Customer.Validate(Name, ImportLogRec."Client Reason");
        Customer.Validate("VAT Registration No.", ImportLogRec."CIF/NIF");
        Customer.Validate(Address, ImportLogRec.Address);
        Customer.Validate("Post Code", ImportLogRec."Post Code");
        Customer.Validate(City, ImportLogRec.City);
        Customer.Validate(County, ImportLogRec.Province);

        // Assignació defensiva: si el camp obligatori està buit, posem un valor existent a la taula Customer Posting Group
        if Customer."Gen. Bus. Posting Group" = '' then
            Customer.Validate("Gen. Bus. Posting Group", 'NAC');

        if Customer."Customer Posting Group" = '' then
            Customer.Validate("Customer Posting Group", 'NAC');

        Customer.Modify(true);
    end;

    local procedure CreateCustomerFromTemplate(
        var Customer: Record Customer;
        TemplateCode: Code[20];
        ImportLogRec: Record "ImportLogTable")
    var
        CustomerTempl: Record "Customer Templ.";
        TemplateNotFound: Label 'Customer %1 template not found', Comment = 'ESP="Plantilla del cliente %1 no encontrada"';
    begin
        if not CustomerTempl.Get(TemplateCode) then
            Error(TemplateNotFound, TemplateCode);

        Customer.SetInsertFromTemplate(true);
        Customer.Init();
        CustomerTempl.TransferFields(Customer, false);
        Customer."No." := '';
        Customer.Insert(true);
        Customer.SetInsertFromTemplate(false);

        Customer.Validate(Name, ImportLogRec."Client Reason");
        Customer.Validate("VAT Registration No.", ImportLogRec."CIF/NIF");
        Customer.Validate(Address, ImportLogRec.Address);
        Customer.Validate("Post Code", ImportLogRec."Post Code");
        Customer.Validate(City, ImportLogRec.City);
        Customer.Validate(County, ImportLogRec.Province);

        // Assignació defensiva per assegurar que els camps obligatoris de comptabilitat tinguin valor
        if Customer."Gen. Bus. Posting Group" = '' then
            Customer.Validate("Gen. Bus. Posting Group", 'NAC');

        if Customer."Customer Posting Group" = '' then
            Customer.Validate("Customer Posting Group", 'NAC');

        Customer.Modify(true);
    end;
}
