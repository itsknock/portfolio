page 50140 "Import Log Page"
{
    AutoSplitKey = true;
    DelayedInsert = true;
    PageType = List;
    SourceTable = "ImportLogTable";
    ApplicationArea = All;
    UsageCategory = Lists;

    layout
    {
        area(content)
        {
            repeater(Group)
            {
                field("Company Reason"; Rec."Company Reason")
                {
                    ApplicationArea = All;
                }
                field("Client Reason"; Rec."Client Reason")
                {
                    ApplicationArea = All;
                }
                field("CIF/NIF"; Rec."CIF/NIF")
                {
                    ApplicationArea = All;
                }
                field("Address"; Rec."Address")
                {
                    ApplicationArea = All;
                }
                field("Post Code"; Rec."Post Code")
                {
                    ApplicationArea = All;
                }
                field("City"; Rec."City")
                {
                    ApplicationArea = All;
                }
                field("Province"; Rec."Province")
                {
                    ApplicationArea = All;
                }
                field("Type"; Rec."Type")
                {
                    ApplicationArea = All;
                }
                field("Series"; Rec."Series")
                {
                    ApplicationArea = All;
                }
                field("Number"; Rec."Number")
                {
                    ApplicationArea = All;
                }
                field("Date"; Rec."Date")
                {
                    ApplicationArea = All;
                }
                field("T.10% Base"; Rec."T.10% Base")
                {
                    ApplicationArea = All;
                }
                field("T.10% VAT"; Rec."T.10% VAT")
                {
                    ApplicationArea = All;
                }
                field("T.4% Base"; Rec."T.4% Base")
                {
                    ApplicationArea = All;
                }
                field("T.4% VAT"; Rec."T.4% VAT")
                {
                    ApplicationArea = All;
                }
                field("T.21% Base"; Rec."T.21% Base")
                {
                    ApplicationArea = All;
                }
                field("T.21% VAT"; Rec."T.21% VAT")
                {
                    ApplicationArea = All;
                }
                field("Total"; Rec."Total")
                {
                    ApplicationArea = All;
                }
                field("Status"; Rec."Status")
                {
                    ApplicationArea = All;
                }
                field("Client process status"; Rec."Client process Status")
                {
                    ApplicationArea = All;
                }
                field("Customer No."; Rec."Customer No.")
                {
                    ApplicationArea = All;
                }
                field("Sales invoice No."; Rec."Sales invoice No.")
                {
                    ApplicationArea = All;
                }
                field("Registered Sales invoice No."; Rec."Registered Sales invoice No.")
                {
                    ApplicationArea = All;
                }

            }
        }
    }

    actions
    {
        area(Processing)
        {
            action(ImportExcel)
            {
                ApplicationArea = All;
                Caption = 'Import', Comment = 'ESP="Importar"';
                Image = Import;
                Promoted = true;
                PromotedCategory = Process;
                PromotedIsBig = true;

                trigger OnAction()
                var
                    ImportLogMgt: Codeunit "Import Log Mgt";
                begin
                    ImportLogMgt.ImportExcel(Rec);
                    CurrPage.Update(false);
                end;
            }

            action(ProcessLines)
            {
                ApplicationArea = All;
                Caption = 'Process';
                Image = Process;
                Promoted = true;
                PromotedCategory = Process;
                PromotedIsBig = true;

                trigger OnAction()
                var
                    SelectedLines: Record "ImportLogTable";
                    ProcessImportLines: Codeunit "Process import lines";
                begin
                    CurrPage.SetSelectionFilter(SelectedLines);

                    if SelectedLines.IsEmpty() then
                        exit;

                    ProcessImportLines.ProcessImportLines(SelectedLines);

                    CurrPage.Update(false);
                end;
            }


            action(ViewError)
            {
                ApplicationArea = All;
                Caption = 'View Error', Comment = 'ESP="Ver Error"';
                Image = Error;
                Promoted = true;
                PromotedCategory = Process;

                trigger OnAction()
                var
                    MultipleLinesSelected: Label 'Select exactly (1) line to view its error.', Comment = 'ESP="Selecciona (1) línea para ver el Error"';
                    NoErrorStatus: Label 'The selected line has NO Error status.', Comment = 'ESP="La línea seleccionada NO tiene estado de Error"';
                    NoErrorMessage: Label 'No error message available.', Comment = 'ESP="No hay mensaje de error disponible"';
                    SelLog: Record "ImportLogTable";
                begin
                    CurrPage.SetSelectionFilter(SelLog);

                    if SelLog.Count <> 1 then begin
                        Message(MultipleLinesSelected);
                        exit;
                    end;

                    SelLog.FindFirst();

                    if SelLog."Status" <> SelLog."Status"::Error then begin
                        Message(NoErrorStatus);
                        exit;
                    end;

                    if SelLog."Error" = '' then begin
                        Message(NoErrorMessage);
                        exit;
                    end;

                    Message(SelLog."Error");
                end;
            }
        }
    }
}
