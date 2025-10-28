using System;

namespace PbsApi.Utils.Model
{
    [AttributeUsage(AttributeTargets.Property , AllowMultiple = true)]
    public class WhereAttribute : Attribute
    {
        public string Expression { get; set; }

        public WhereAttribute(string expression)
        {
            Expression = expression;
        }
    }
}
