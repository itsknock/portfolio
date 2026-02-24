page 50110 "Vendor Pictures API"
{
    PageType = API;
    APIPublisher = 'YourPublisher';
    APIGroup = 'VendorImages';
    APIVersion = 'v1.0';
    EntityName = 'VendorPicture';
    EntitySetName = 'VendorPictures';
    SourceTable = Vendor;
    ODataKeyFields = "No.";

    DelayedInsert = true;
    InsertAllowed = true;
    DeleteAllowed = true;

    layout
    {
        area(content)
        {
            field(no; Rec."No.")
            {
                Caption = 'No.';
            }
        }
    }

    trigger OnInsertRecord(BelowxRec: Boolean): Boolean
    var
        NoSeries: Codeunit "No. Series";
    begin
        if Rec."No." = '' then
            Rec."No." := NoSeries.GetNextNo('VENDOR', TODAY, TRUE);
        exit(true);
    end;
}



