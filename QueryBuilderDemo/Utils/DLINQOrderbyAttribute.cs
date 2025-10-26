using System;

namespace PbsApi.Utils.Model
{
    [AttributeUsage(AttributeTargets.Property , AllowMultiple = true)]
    public class DLINQOrderbyAttribute : Attribute
    {
        public string PropertyName { get; set; }
        public bool Descending { get; set; } = false;

        public DLINQOrderbyAttribute(string propertyName, bool descending = false)
        {
            PropertyName = propertyName;
            Descending = descending;
        }
    }
}
