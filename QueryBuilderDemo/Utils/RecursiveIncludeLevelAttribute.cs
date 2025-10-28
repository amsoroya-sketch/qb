using System;

namespace PbsApi.Utils.Model
{
    [AttributeUsage(AttributeTargets.Property, Inherited = true, AllowMultiple = false)]
    public class RecursiveIncludeLevelAttribute : Attribute
    {
        public int Level { get; set; }

        public RecursiveIncludeLevelAttribute(int level)
        {
            Level = level;
        }
    }
}
