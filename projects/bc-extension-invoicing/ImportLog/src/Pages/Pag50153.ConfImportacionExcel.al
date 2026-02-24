page 50153 "Conf. Importacion Excel"
{
    PageType = Card;
    SourceTable = "Conf. Importacion Excel";
    Caption = 'Conf. Importación Excel';
    ApplicationArea = All;
    UsageCategory = Administration;
    DeleteAllowed = false;
    InsertAllowed = false;
    ModifyAllowed = true;

    layout
    {
        area(content)
        {
            group(General)
            {

                // Customer template selection
                field("Plantilla Cliente"; Rec."Customer Template")
                {
                    ApplicationArea = All;
                    ToolTip = 'Select customer template for new customers', Comment = 'ESP="Elige una plantilla para clientes nuevos"';
                }
                field("Invoice Serial No."; Rec."Invoice Serial No.")
                {
                    ApplicationArea = All;
                }
                field("Registration Serial No."; Rec."Registration Serial No.")
                {
                    ApplicationArea = All;
                }
                // --- NUEVOS CAMPOS PARA LINEAS DE FACTURA ---
                field("Account No."; Rec."Account No.")
                {
                    ApplicationArea = All;
                }

                field("Compensation Account No."; Rec."Compensation Account No.")
                {
                    ApplicationArea = All;
                }
                field("VAT Product 10%"; Rec."VAT10")
                {
                    ApplicationArea = All;
                }

                field("VAT Product 4%"; Rec."VAT4")
                {
                    ApplicationArea = All;
                }
                field("VAT Product 21%"; Rec."VAT21")
                {
                    ApplicationArea = All;
                }
                field("Compensation VAT Product"; Rec."VATComp")
                {
                    ApplicationArea = All;
                }
                field("G/L Account"; Rec."G/L Account")
                {
                    ApplicationArea = All;
                }

            }
        }
    }

    trigger OnOpenPage()
    var
        ConfImportExcel: Record "Conf. Importacion Excel";
    begin
        // Ensure the SETUP record exists
        if not ConfImportExcel.Get('SETUP') then begin
            ConfImportExcel.Init();
            ConfImportExcel."Primary Key" := 'SETUP';
            ConfImportExcel.Insert();
        end;

        Rec.Get(ConfImportExcel."Primary Key");
    end;
}
