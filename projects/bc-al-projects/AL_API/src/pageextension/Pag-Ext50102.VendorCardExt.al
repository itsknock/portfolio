pageextension 50102 VendorCardExt extends "Vendor Card"
{
    layout
    {
        addlast(General)
        {
            field("EstadoHomologacion"; Rec."EstadoHomologacion")
            {
                ApplicationArea = All;
                Editable = true;
            }
        }
    }
}
