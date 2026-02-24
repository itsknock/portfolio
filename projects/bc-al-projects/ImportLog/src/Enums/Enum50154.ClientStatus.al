enum 50154 "Client process status"
{
    Extensible = true;

    value(0; "Created")
    {
        Caption = 'Created new client', Comment = 'ESP="Nuevo cliente creado"';
    }

    value(1; "Updated")
    {
        Caption = 'Updated existing client', Comment = 'ESP="Cliente existente actualizado "';
    }

    value(2; "Pending")
    {
        Caption = 'Pending processing', Comment = 'ESP=" Pendiente de processar"';
    }
}
