using System;

namespace PbsApi.Utils.Model
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Class, AllowMultiple = true)]
    public class DLINQOrderbyAttribute : Attribute
    {
        public string PropertyName { get; set; }
        public bool Descending { get; set; }

        public DLINQOrderbyAttribute(string propertyName, bool descending = false)
        {
            PropertyName = propertyName;
            Descending = descending;
        }
    }
}
