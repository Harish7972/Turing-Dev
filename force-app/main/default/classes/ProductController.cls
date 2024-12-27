public class ProductController {

    @AuraEnabled(cacheable=true)  // Enable caching for improved performance
    public static Map<String, Object> fetchProducts(Integer pageNumber, Integer pageSize) {
        // Calculate the offset for pagination based on page number and page size
        Integer offset = (pageNumber - 1) * pageSize;

        // Query to fetch the products with pagination
        List<Product2> products = [SELECT Id, Name FROM Product2 LIMIT :pageSize OFFSET :offset];
        
        // Query to get the total count of products
        Integer totalRecords = [SELECT COUNT() FROM Product2];

        // Prepare the response
        Map<String, Object> response = new Map<String, Object>();
        response.put('products', products);
        response.put('totalRecords', totalRecords);

        return response;
    }
}