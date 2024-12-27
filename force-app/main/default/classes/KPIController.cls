public with sharing class KPIController {
    @AuraEnabled(cacheable=true)
    public static String getExampleClientId() {
        // Fetch a sample clientId dynamically from an existing record
        Account sampleAccount = [
            SELECT Client_ID__c
            FROM Account
            WHERE Client_ID__c != null
            LIMIT 1
        ];
        return sampleAccount.Client_ID__c;
    }

    @AuraEnabled(cacheable=true)
    public static List<ClientData> getKPIData(String clientId, Integer pageNumber, Integer pageSize) {
        Integer offsetVal = (pageNumber - 1) * pageSize;

        // Fetch paginated data
        List<Account> clientRecords = [
            SELECT Id, Name, Total_Sales__c, Last_Deal__c, Client_ID__c
            FROM Account
            WHERE Client_ID__c = :clientId
            ORDER BY Name
            LIMIT :pageSize OFFSET :offsetVal
        ];

        List<ClientData> clientDataList = new List<ClientData>();
        for (Account acc : clientRecords) {
            ClientData data = new ClientData();
            data.clientId = acc.Id;
            data.clientName = acc.Name;
            data.totalSales = acc.Total_Sales__c;
            data.lastDeal = acc.Last_Deal__c;
            clientDataList.add(data);
        }
        return clientDataList;
    }

    @AuraEnabled(cacheable=true)
    public static Integer getKPIDataCount(String clientId) {
        return [SELECT COUNT() FROM Account WHERE Client_ID__c = :clientId];
    }

    public class ClientData {
        @AuraEnabled public String clientId;
        @AuraEnabled public String clientName;
        @AuraEnabled public Decimal totalSales;
        @AuraEnabled public Date lastDeal;
    }
}