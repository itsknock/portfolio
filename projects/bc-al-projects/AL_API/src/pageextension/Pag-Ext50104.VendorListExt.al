pageextension 50104 VendorListExt extends "Vendor List"
{
    layout
    {
        addlast(Control1)
        {
            field("EstadoHomologacion"; Rec."EstadoHomologacion")
            {
                ApplicationArea = All;
            }
        }
    }
}
