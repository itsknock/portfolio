page 50101 "API Homologacion"
{
    APIGroup = 'apiGroup';
    APIPublisher = 'publisherName';
    APIVersion = 'v1.0';
    ApplicationArea = All;
    Caption = 'apiHomologacion';
    EntityName = 'VendorHomologacion';
    EntitySetName = 'VendorHomologacions';
    PageType = API;
    SourceTable = Vendor;
    ODataKeyFields = "No.";

    DelayedInsert = true;
    InsertAllowed = true;
    DeleteAllowed = true;

    layout
    {
        area(Content)
        {
            repeater(General)
            {
                field(no; Rec."No.")
                {
                    Caption = 'No.';
                }
                field(id; Rec.SystemId)
                {
                    Caption = 'Id';
                }
                field(contact; Rec.Contact)
                {
                    Caption = 'Contact';
                }
                field(name; Rec.Name)
                {
                    Caption = 'Name';
                }
                field(eMail; Rec."E-Mail")
                {
                    Caption = 'Email';
                }
                field(countryRegionCode; Rec."Country/Region Code")
                {
                    Caption = 'Country/Region Code';
                }
                field(estadoHomologacion; Rec.EstadoHomologacion)
                {
                    Caption = 'Estado Homologación';
                }
                field(image; Rec.Image)
                {
                    Caption = 'Image';
                }
                field(address; Rec.Address)
                {
                    Caption = 'Address';
                }
            }
        }
    }


}
