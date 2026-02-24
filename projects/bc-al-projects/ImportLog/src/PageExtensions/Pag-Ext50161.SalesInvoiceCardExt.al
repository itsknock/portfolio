pageextension 50161 "Sales Invoice List Ext" extends "Sales Invoice List"
{
    layout
    {
        addafter("No.")
        {
            field("Importe Excel"; Rec."Importe Excel")
            {
                ApplicationArea = All;
                ToolTip = 'Importe total des del fitxer Excel';
            }
        }
    }
}



