using PbsApi.Utils.Model;

namespace QueryBuilderDemo.Tests.Models
{
    public class Location
    {
        public int Id { get; set; }
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;

        // Navigation properties
        [RecursiveIncludeLevel(2)]
        [DLINQOrderbyAttribute("Name")]
        public List<Client> Clients { get; set; } = new();
    }
}
