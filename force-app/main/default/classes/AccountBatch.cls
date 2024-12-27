global class AccountBatch implements Database.Batchable<SObject> {
    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator('SELECT Id FROM Account');
    }
    public void execute(Database.BatchableContext bc, List<SObject> scope) {
        // Process each batch of accounts
    }
    public void finish(Database.BatchableContext bc) {
        // Post-processing actions
    }
}