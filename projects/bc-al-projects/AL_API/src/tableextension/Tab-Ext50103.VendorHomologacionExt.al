tableextension 50103 "VendorHomologacionExt" extends Vendor
{
    fields
    {
        field(50100; "EstadoHomologacion"; Enum "Homologacion")
        {
            Caption = 'Estado Homologación';
            trigger OnValidate()
            begin
                if "EstadoHomologacion" <> Homologacion::Homologado then
                    Validate("Blocked", "Vendor Blocked"::All)   // bloquejat total
                else
                    Validate("Blocked", "Vendor Blocked"::" ");   // sense bloqueig
            end;
        }
    }

    trigger OnBeforeInsert()
    var
        NoSeries: Codeunit "No. Series";
    begin
        "No." := NoSeries.GetNextNo('VENDOR', TODAY, TRUE);
    end;

}
