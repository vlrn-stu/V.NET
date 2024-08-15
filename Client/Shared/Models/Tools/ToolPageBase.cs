using Microsoft.AspNetCore.Components;

namespace V.NET.Client.Shared.Models.Tools
{
    public abstract class ToolPageBase : ComponentBase
    {
        public abstract ToolModel Tool { get; }
    }
}
