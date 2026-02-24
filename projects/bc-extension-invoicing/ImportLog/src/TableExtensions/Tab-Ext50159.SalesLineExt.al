tableextension 50160 "Sales Line Ext" extends "Sales Line"
{
    fields
    {
        field(50100; "VAT Product Posting Group"; Code[20])
        {
            Caption = 'VAT Product Posting Group', Comment = 'ESP="Grupo de registro IVA producto para la línea de factura"';
            TableRelation = "VAT Product Posting Group"."Code";
        }
    }
}
