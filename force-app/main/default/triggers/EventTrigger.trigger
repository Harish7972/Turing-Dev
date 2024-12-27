trigger EventTrigger on Event_Log__c (before insert) {
	EventProcessor.processEvents(Trigger.new);
}