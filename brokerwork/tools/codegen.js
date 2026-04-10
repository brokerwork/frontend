/* don't format this file, otherwise format will be not correct */
function genClassFromModels(s){
    var injectExports = s.replace(/(\w+) \{/g, function(m,m1){
        return 'export class '+m1 + "{"
    });
    var injectFields = injectExports.replace(/(\w+) \((\w+), \w+\),?/g, function(m,m1,m2){
        if (m2 === 'integer'){
            m2 = 'number';
        }
        return `${m1}:${m2};`;
    });
    var es6Classes = injectFields.replace(/([^\}]+)\}/g, function(m, m1){
        return `${m1}constructor(data){Object.assign(this, data)}
}`;
    })
    return es6Classes;
}
console.log(genClassFromModels(`ResponseDTOOfPaginationDTOOfCustomerPropertiesDTO {
data (PaginationDTOOfCustomerPropertiesDTO, optional),
mcode (string, optional),
result (boolean, optional)
}
PaginationDTOOfCustomerPropertiesDTO {
list (Array[CustomerPropertiesDTO], optional),
offset (integer, optional),
pager (integer, optional),
pages (integer, optional),
size (integer, optional),
total (integer, optional)
}
CustomerPropertiesDTO {
createTime (integer, optional),
creator (string, optional),
customProfile (CustomProfile, optional),
customerId (string, optional),
enabled (boolean, optional),
mainContact (CustomContact, optional),
modifyTime (integer, optional),
productId (string, optional) = ['TW', 'BW', 'DW', 'CW', 'OW', 'FW', 'SC']
string
Enum:	"TW", "BW", "DW", "CW", "OW", "FW", "SC"
,
recordList (Array[SalesRecord], optional),
redundancy (CustomRedundancy, optional),
tenantId (string, optional)
}
CustomProfile {
address (string, optional),
ambitious (string, optional),
city (string, optional),
comments (string, optional),
country (string, optional),
customNo (string, optional),
customSource (string, optional),
customType (string, optional),
faxes (string, optional),
idNum (string, optional),
idType (string, optional),
importance (string, optional),
introducer (string, optional),
phone (string, optional),
postcode (string, optional),
priority (string, optional),
province (string, optional),
revisitDay (integer, optional),
site (string, optional),
social (string, optional)
}
CustomContact {
birthday (integer, optional),
comments (string, optional),
contactsName (string, optional),
email (string, optional),
gender (string, optional) = ['Male', 'Female']
string
Enum:	"Male", "Female"
,
others (string, optional),
phone (string, optional),
resign (string, optional)
}
SalesRecord {
autoRecord (boolean, optional),
comments (string, optional),
communication (string, optional),
createTime (integer, optional),
recordFile (string, optional),
recordId (string, optional)
}
CustomRedundancy {
customName (string, optional),
oweId (string, optional),
oweName (string, optional)
}`))
