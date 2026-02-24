table 50152 "Conf. Importacion Excel"
{
    Caption = 'Conf. Importación Excel';
    DataClassification = CustomerContent;

    fields
    {
        field(1; "Primary Key"; Code[10])
        {
            Caption = 'Primary Key', Comment = 'ESP="Clave primaria"';
        }
        field(2; "Customer Template"; Code[20])
        {
            Caption = 'Customer Template', Comment = 'ESP="Plantilla Cliente"';
            TableRelation = "Customer Templ."."Code";

            trigger OnValidate()
            var
                CustTempl: Record "Customer Templ.";
            begin
                if "Customer Template" <> '' then begin
                    CustTempl.Get("Customer Template");
                    CustTempl.TestField(Blocked, CustTempl.Blocked::" ");
                end;
            end;
        }
        field(17; "Invoice Serial No."; Code[20])
        {
            Caption = 'Invoice Serial No.', Comment = 'ESP="No. Factura de venta"';
            TableRelation = "No. Series"."Code";
        }
        field(18; "Registration Serial No."; Code[20])
        {
            Caption = 'Registration Serial No.', Comment = 'ESP="No. Serie Registro"';
            TableRelation = "No. Series"."Code";
        }
        //Fields for sales invoice "lines"
        field(19; "G/L Account"; Code[20])
        {
            Caption = 'G/L Account', Comment = 'ESP= "No. Cuenta Contable"';
            TableRelation = "G/L Account";
        }
        field(20; "Account No."; Code[20])
        {
            Caption = 'Invoice Line Account', Comment = 'ESP="Cuenta contable por defecto para líneas de factura"';
            TableRelation = "G/L Account"."No.";
        }

        field(21; "Compensation Account No."; Code[20])
        {
            Caption = 'Compensation Account No.', Comment = 'ESP="No. cuenta contable compensación"';
            TableRelation = "G/L Account"."No.";
        }

        field(22; "VAT10"; Code[20])
        {
            Caption = 'VAT 10%';
            TableRelation = "VAT Product Posting Group"."Code";
        }

        field(23; "VAT4"; Code[20])
        {
            Caption = 'VAT 4%';
            TableRelation = "VAT Product Posting Group"."Code";
        }

        field(24; "VAT21"; Code[20])
        {
            Caption = 'VAT 21%';
            TableRelation = "VAT Product Posting Group"."Code";
        }

        field(25; "VATComp"; Code[20])
        {
            Caption = 'VAT Compensation';
            TableRelation = "VAT Product Posting Group"."Code";
        }

        field(26; "VATType"; Code[20])
        {
            Caption = 'VAT Type';
            TableRelation = "VAT Product Posting Group"."Code";
        }



    }
    keys
    {
        key(PK; "Primary Key") { Clustered = true; }
    }
}
