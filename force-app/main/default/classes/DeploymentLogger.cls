public class DeploymentLogger {
    public static void logDeployment(String status, String changes) {
        Deployment_Log__c deploymentLog = new Deployment_Log__c(
            Deployment_Date__c = System.now(),
            Status__c = status,
            Change__c = changes
        );
        insert deploymentLog;
    }
}