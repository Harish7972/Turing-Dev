global class PaymentReportScheduler implements Schedulable {

    global void execute(SchedulableContext sc) {
        Date today = Date.today();
        PaymentAnalyticsService.generateReport(today);
        notifyStakeholders(today);
    }

    private void notifyStakeholders(Date reportDate) {
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.setToAddresses(new List<String>{'harish.j@turing.com'}); // Replace with actual emails
        email.setSubject('New Payment Analytics Report Generated');
        email.setPlainTextBody('The payment analytics report for ' + reportDate.format() + ' has been generated.');

        Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{email});
    }
}