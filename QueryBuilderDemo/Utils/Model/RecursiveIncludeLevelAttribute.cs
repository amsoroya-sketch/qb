using System;

namespace PbsApi.Utils.Model
{
    [AttributeUsage(AttributeTargets.Property)]
    public class RecursiveIncludeLevelAttribute : Attribute
    {
        public int Level { get; set; }

        public RecursiveIncludeLevelAttribute(int level)
        {
            Level = level;
        }
    }
}
