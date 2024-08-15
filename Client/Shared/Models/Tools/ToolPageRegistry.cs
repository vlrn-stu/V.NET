namespace V.NET.Client.Shared.Models.Tools
{
    public static class ToolPageRegistry
    {
        private static readonly List<ToolModel> Tools = [];

        public static void RegisterTool(ToolModel tool)
        {
            Tools.Add(tool);
        }

        public static List<ToolModel> GetTools()
        {
            return Tools;
        }
    }

}
