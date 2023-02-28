# client = Restforce.new(username: Rails.application.credentials.salesforce[:username],
#                        password: Rails.application.credentials.salesforce[:password],
#                        client_id: Rails.application.credentials.salesforce[:client_id],
#                        client_secret: Rails.application.credentials.salesforce[:client_secret],
#                        api_version: '41.0')
#
# Sample Queries
# MAKE SURE YOU DO NOT PUSH DATA TO SALESFORCE. READ ONLY
#  https://github.com/restforce/restforce
#
#  client.find('Residential_Projects__c', 'a003m00001gOUPeAAO')
#  client.find('Lead', '00Q3m00000xWKCeEAO')
#  client.find('Opportunity', '0063m00000jgP20AAE')
#  client.find('Account', '0013m00002FkrXKAAZ')
#
#  client.query("SELECT Id, Name FROM Installer__c WHERE LastReferencedDate > 2020-01-01T00:00:00Z AND Name != 'test installer' AND IsDeleted = false")
#  client.query("SELECT Id FROM Proposal_Requested_Date_time__c")
