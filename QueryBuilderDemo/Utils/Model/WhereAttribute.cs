using System;

namespace PbsApi.Utils.Model
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Class)]
    public class WhereAttribute : Attribute
    {
        public string Expression { get; set; }

        public WhereAttribute(string expression)
        {
            Expression = expression;
        }
    }
}
