table 50144 "ImportLogTable"
{
    Caption = 'Log Importación';
    DataClassification = ToBeClassified;
    TableType = Normal;

    fields
    {

        field(1; "Company Reason"; Text[100])
        {
            Caption = 'Company Reason', Comment = 'ESP="Razon Empresa"';
        }
        field(2; "Client Reason"; Text[100])
        {
            Caption = 'Client Reason', Comment = 'ESP= "Razon cliente"';
        }
        field(3; "CIF/NIF"; Code[20])
        {
            Caption = 'CIF/NIF', Comment = 'ESP= "CIF/NIF"';
        }
        field(4; "Address"; Text[100])
        {
            Caption = 'Address', Comment = 'ESP= "Direccion';
        }
        field(5; "Post Code"; Code[20])
        {
            Caption = 'Post Code', Comment = 'ESP="C.P."';
        }
        field(6; "City"; Text[50])
        {
            Caption = 'City', Comment = 'ESP="Municipio';
        }
        field(7; "Province"; Text[50])
        {
            Caption = 'Province', Comment = 'ESP="Provincia"';
        }
        field(8; "Type"; Text[30])
        {
            Caption = 'Type', Comment = 'ESP="Tipo"';
        }
        field(9; "Series"; Code[10])
        {
            Caption = 'Series', Comment = 'ESP="Serie"';
        }
        field(10; "Number"; Integer)
        {
            Caption = 'Number', Comment = 'ESP="Numero"';
        }
        field(11; "Date"; Date)
        {
            Caption = 'Date', Comment = 'ESP="Fecha"';
        }
        field(12; "T.10% Base"; Decimal)
        {
            Caption = 'T.10% Base', Comment = 'ESP="T.10%"';
        }
        field(13; "T.10% VAT"; Decimal)
        {
            Caption = 'T.10% VAT', Comment = 'ESP="T.10%"';
        }
        field(14; "T.4% Base"; Decimal)
        {
            Caption = 'T.4% Base', Comment = 'ESP="T.4%"';
        }
        field(15; "T.4% VAT"; Decimal)
        {
            Caption = 'T.4% VAT', Comment = 'ESP="T.4%"';
        }
        field(16; "T.21% Base"; Decimal)
        {
            Caption = 'T.21% Base', Comment = 'ESP="T.21%"';
        }
        field(17; "T.21% VAT"; Decimal)
        {
            Caption = 'T.21% VAT', Comment = 'ESP="T.21%"';
        }
        field(18; "Total"; Decimal)
        {
            Caption = 'Total', Comment = 'ESP="Total"';
        }
        field(19; "Status"; Enum "Status")
        {
            Caption = 'Status', Comment = 'ESP="Estado"';
            InitValue = Pending;
        }
        field(20; "Error"; Text[250])
        {
            Caption = 'Error', Comment = 'ESP="Error';
        }
        field(21; "Customer No."; Code[20])
        {
            Caption = ' Customer No.', Comment = 'ESP= "No. Cliente"';
        }
        field(22; "Client process Status"; Enum "Client process Status")
        {
            Caption = 'Processing status', Comment = 'ESP="Estado del procesado"';
            InitValue = "Pending";

        }
        field(23; "Sales invoice No."; Code[20])
        {
            Caption = 'Sales invoice No.', Comment = 'ESP= "No. Factura de venta"';
        }
        field(24; "Registered sales invoice No."; Code[20])
        {
            Caption = ' Registered sales invoice No.', Comment = 'ESP= "No. Factura de venta registrada"';
        }
        field(50100; "Customer Template"; Code[10])
        {
            Caption = 'Customer Template', Comment = 'ESP="Plantilla Cliente"';
            TableRelation = "Customer Templ.";
        }


    }

    keys
    {
        key(PK; "Number", "Series")
        {
            Clustered = true;
        }
    }
}

