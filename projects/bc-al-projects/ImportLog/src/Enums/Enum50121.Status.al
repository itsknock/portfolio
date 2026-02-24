enum 50121 "Status"
{
    Extensible = true;

    value(0; "Pending")
    {
        Caption = 'Pending', Comment = 'ESP="Pendiente"';
    }

    value(1; "Processed")
    {
        Caption = 'Processed', Comment = 'ESP="Procesado"';
    }

    value(2; "Error")
    {
        Caption = 'Error', Comment = 'ESP= "ERROR"';
    }
}
