using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using System.Reflection;
using V.NET.Client;
using V.NET.Client.Shared.Models.Tools;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });

// Get all types that inherit from ToolPageBase
var toolPageTypes = AppDomain.CurrentDomain.GetAssemblies()
    .SelectMany(assembly => assembly.GetTypes())
    .Where(type => type.IsSubclassOf(typeof(ToolPageBase)) && !type.IsAbstract);

// Register each tool model
foreach (var type in toolPageTypes)
{
    // Get the Tool property from each derived class
    var toolProperty = type.GetProperty("Tool", BindingFlags.Instance | BindingFlags.Public);
    if (toolProperty != null)
    {
        // Create an instance of the type to access the non-static property
        var instance = Activator.CreateInstance(type) as ToolPageBase;
        if (instance != null)
        {
            var toolModel = toolProperty.GetValue(instance) as ToolModel;
            if (toolModel != null)
            {
                ToolPageRegistry.RegisterTool(toolModel);
            }
        }
    }
}

await builder.Build().RunAsync();
